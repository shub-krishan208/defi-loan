import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler # Assuming you used StandardScaler
import joblib


df = pd.read_csv(r'C:\AYUSH\CGS\BlockChainGame\hackathon_blchain\balanced_applicants_2000.csv')
# Select only the numerical columns from the original df
df_work = df.drop(columns=['default_12m','pd_12m','applicant_id'])
df_numeric_original = df_work.select_dtypes(include=np.number)

print(df_numeric_original.head())
# # Initialize the StandardScaler
scaler = StandardScaler()

# Apply the scaler to the numerical columns
df_scaled = scaler.fit_transform(df_numeric_original)

# Convert the scaled data back to a DataFrame (optional, but good for inspection)
# df_scaled = pd.DataFrame(df_scaled, columns=df_numeric_original.columns)

scaled_features = scaler.fit_transform(df_numeric_original)
df_scaled = pd.DataFrame(scaled_features, columns=df_work.columns[:-1])
df_scaled['default_12m'] = df['default_12m']

# --- Your existing code starts here ---
X = df_scaled.drop('default_12m', axis=1)
y = df_scaled['default_12m']

smote = SMOTE(random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

# 1. Define parameter grid
param_dist = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [None, 10, 20, 30, 50],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2'],
    'bootstrap': [True, False]
}

# 2. RandomizedSearchCV
rf = RandomForestClassifier(random_state=42, n_jobs=-1, class_weight="balanced")
rf_random = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    n_iter=30,
    cv=5,
    verbose=2,
    random_state=42,
    n_jobs=-1,
    scoring='roc_auc'
)
rf_random.fit(X_train_res, y_train_res)

print("Best Parameters:", rf_random.best_params_)
print("Best CV ROC-AUC:", rf_random.best_score_)

# 3. Evaluate on Test Set
best_rf = rf_random.best_estimator_
y_pred = best_rf.predict(X_test)
y_probs = best_rf.predict_proba(X_test)[:, 1]

print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nROC-AUC:", roc_auc_score(y_test, y_probs))

# ==================================================
# 4. SAVE THE MODEL AND THE SCALER
# ==================================================
# Use joblib to save your trained model
joblib.dump(best_rf, 'random_forest_model.joblib')
print("Model saved as random_forest_model.joblib")

# It is critical to also save the scaler object
joblib.dump(scaler, 'scaler.joblib')
print("Scaler saved as scaler.joblib")


