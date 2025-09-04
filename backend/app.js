import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { viewLedger, findUser, updateDues, addColl } from "./db.js";
import router from "./routes.js";
import { defaultUser } from "./auth/user.js";

const app = express();
const PORT = 5001;

app.use(cors({ origin: ["http://localhost:8080"] }));

/*
 * Works to be done by the backend
 * @db-fr 1. Add a new user to the @db
 * @ml-bk 2. forward the user profile to the @ml-model in the backend for eligibility check
 * @fr-bk 3. return the maximum loan amount to @frontend
 * @bk-fr 4. receive the requested amount from @frontend
 * @fr-bk 5. Process and return the required amount of the collateral, return to @frontend
 * @db-fr 6. Receive the collateral path (or Collateral ID) from @frontend
 * @sc-bk 7. Upon verification, pass the loan @smart-contract interaction
 * @db-bk 8. If successful, add the user details to the @db
 * @db-bk 9. If verification fails, delete the user profile form the @db
 * @db-bk 10. If transaction fails, increase the failure count in @db
 * @db-bk 11. UpdateDues @db
 * @sc-bk 12. Interact with @smart-contract for timely EMI deduction
 * @sc-bk 14. Ownership transfer of collateral from lender to borrower @smart-contract
 */

defaultUser();

//middleware to handle frontend requests
app.use("/api/", router);

// some kind of ml-api call to get the required collateral amount.

//storage setup for storing uploaded files:
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const walletAddress = req.body.walletAddress; // coming from frontend form
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const newName = `${walletAddress}_${timestamp}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

// Upload endpoint
/*
* Required fetch request from tehe frontend
fetch("http://localhost:3000/upload", {
  method: "POST",
  id: "user_loan_id",
  body: formData,
})
  */

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join("uploads", req.file.filename);
  addColl(req.body.id, filePath); // add coll path to db
  res.json({
    message: "File uploaded successfully",
  });
});

// some way to verify the collateral

//assuming collateral is validated: smart contract calls

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
