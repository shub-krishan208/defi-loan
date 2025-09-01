import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUp, DollarSign, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoanApplicationFormProps {
  walletAddress: string;
}

interface LoanData {
  accountId: string;
  name: string;
  cibil: string;
  requestedAmount: string;
  maxLoanAmount?: number;
  minimumCollateral?: number;
  collateralValue?: number;
  loanStatus?: "pending" | "approved" | "rejected";
}

export const LoanApplicationForm = ({
  walletAddress,
}: LoanApplicationFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loanData, setLoanData] = useState<LoanData>({
    accountId: walletAddress,
    name: "",
    cibil: "",
    requestedAmount: "",
  });
  const [collPath, setCollPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof LoanData, value: string) => {
    setLoanData((prev) => ({ ...prev, [field]: value }));
  };

  const submitPersonalDetails = async () => {
    if (!loanData.name || !loanData.cibil) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call to get maximum loan amount
    setTimeout(() => {
      const maxLoan = Math.floor(
        parseInt(loanData.cibil) * 100 + Math.random() * 50000
      );
      setLoanData((prev) => ({ ...prev, maxLoanAmount: maxLoan }));
      setCurrentStep(2);
      setIsLoading(false);

      toast({
        title: "Eligibility Calculated",
        description: `Your maximum loan amount: $${maxLoan.toLocaleString()}`,
      });
    }, 2000);
  };

  const submitLoanAmount = async () => {
    if (!loanData.requestedAmount) {
      toast({
        title: "Missing Amount",
        description: "Please enter your desired loan amount",
        variant: "destructive",
      });
      return;
    }

    const requested = parseInt(loanData.requestedAmount);
    if (requested > (loanData.maxLoanAmount || 0)) {
      toast({
        title: "Amount Too High",
        description: "Requested amount exceeds your eligibility",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call to calculate minimum collateral
    setTimeout(() => {
      const minCollateral = requested * 1.5; // 150% collateral requirement
      setLoanData((prev) => ({ ...prev, minimumCollateral: minCollateral }));
      setCurrentStep(3);
      setIsLoading(false);

      toast({
        title: "Collateral Requirement",
        description: `Minimum collateral: $${minCollateral.toLocaleString()}`,
      });
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const submitCollateral = async () => {
    if (!uploadedFile) {
      toast({
        title: "No Document",
        description: "Please upload a collateral document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call for collateral evaluation
    const collateralValue = Math.floor(
      (loanData.minimumCollateral || 0) * (0.8 + Math.random() * 0.4)
    );
    const isApproved = collateralValue >= (loanData.minimumCollateral || 0);

    setLoanData((prev) => ({
      ...prev,
      collateralValue,
      loanStatus: isApproved ? "approved" : "rejected",
    }));

    const payload = {
      pid: loanData.accountId,
      user: loanData.name,
      amt: loanData.requestedAmount,
      cibil: loanData.cibil,
      path: collPath,
    };

    try {
      const response = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back! You have been logged in.",
        });
        localStorage.setItem("token", `Bearer ` + data.token); // storing the jwt locally with the bearer prefix for middleware
      } else {
        throw new Error(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Error while updating the user database:", err);
    }

    setCurrentStep(4);
    setIsLoading(false);

    toast({
      title: isApproved ? "Loan Approved!" : "Insufficient Collateral",
      description: isApproved
        ? "Your loan has been approved and will be distributed shortly"
        : "Collateral value is below minimum requirement",
      variant: isApproved ? "default" : "destructive",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`h-0.5 w-16 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Enter your details to check loan eligibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID (Wallet Address)</Label>
              <Input
                id="accountId"
                value={loanData.accountId}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={loanData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cibil">CIBIL Score</Label>
              <Input
                id="cibil"
                type="number"
                placeholder="Enter your CIBIL score (300-850)"
                value={loanData.cibil}
                onChange={(e) => handleInputChange("cibil", e.target.value)}
                min="300"
                max="850"
              />
            </div>
            <Button
              onClick={submitPersonalDetails}
              disabled={isLoading}
              className="w-full"
              variant="gradient"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Calculating Eligibility...
                </>
              ) : (
                "Check Eligibility"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Loan Amount */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Loan Amount
            </CardTitle>
            <CardDescription>
              You're eligible for up to $
              {loanData.maxLoanAmount?.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="success" className="mb-4">
              Maximum Eligible: ${loanData.maxLoanAmount?.toLocaleString()}
            </Badge>
            <div className="space-y-2">
              <Label htmlFor="requestedAmount">Requested Loan Amount ($)</Label>
              <Input
                id="requestedAmount"
                type="number"
                placeholder={`Enter amount (max: ${loanData.maxLoanAmount})`}
                value={loanData.requestedAmount}
                onChange={(e) =>
                  handleInputChange("requestedAmount", e.target.value)
                }
                max={loanData.maxLoanAmount}
              />
            </div>
            <Button
              onClick={submitLoanAmount}
              disabled={isLoading}
              className="w-full"
              variant="gradient"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Calculating Collateral...
                </>
              ) : (
                "Apply for Loan"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Collateral Upload */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-primary" />
                Collateral Document
              </CardTitle>
              <CardDescription>
                Upload documentation for your collateral worth at least $
                {loanData.minimumCollateral?.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="warning" className="mb-4">
                Minimum Collateral Required: $
                {loanData.minimumCollateral?.toLocaleString()}
              </Badge>
              <div className="space-y-2">
                <Label htmlFor="collateral">Collateral Document</Label>
                <Input
                  id="collateral"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG, DOC, DOCX
                </p>
              </div>
              {uploadedFile && (
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    <strong>File uploaded:</strong> {uploadedFile.name}
                  </p>
                </div>
              )}
              <Button
                onClick={submitCollateral}
                disabled={isLoading || !uploadedFile}
                className="w-full"
                variant="gradient"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Evaluating Collateral...
                  </>
                ) : (
                  "Submit Collateral"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Loan Repayment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Loan Repayment Terms</CardTitle>
              <CardDescription>
                Review the repayment schedule and terms for your loan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground">
                    Interest Rate
                  </p>
                  <p className="text-2xl font-bold text-primary">8.5%</p>
                  <p className="text-xs text-muted-foreground">Annual Rate</p>
                </div>
                <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground">
                    Loan Term
                  </p>
                  <p className="text-2xl font-bold text-primary">24</p>
                  <p className="text-xs text-muted-foreground">Months</p>
                </div>
                <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly EMI
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    $
                    {Math.round(
                      (parseInt(loanData.requestedAmount) * 1.085) / 24
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Fixed Amount</p>
                </div>
                <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total EMIs
                  </p>
                  <p className="text-2xl font-bold text-primary">24</p>
                  <p className="text-xs text-muted-foreground">Payments</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="font-semibold mb-3">Repayment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-medium">
                      ${parseInt(loanData.requestedAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="font-medium">
                      $
                      {Math.round(
                        parseInt(loanData.requestedAmount) * 0.085
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="font-semibold">Total Repayment:</span>
                    <span className="font-semibold">
                      $
                      {Math.round(
                        parseInt(loanData.requestedAmount) * 1.085
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
                <p className="text-sm text-info-foreground">
                  <strong>Important:</strong> Missing 3 consecutive EMI payments
                  may result in collateral liquidation as per smart contract
                  terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Loan Status */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Application Status</CardTitle>
            <CardDescription>
              Review your loan application results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Requested Amount
                </p>
                <p className="text-xl font-semibold">
                  ${loanData.requestedAmount}
                </p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Collateral Value
                </p>
                <p className="text-xl font-semibold">
                  ${loanData.collateralValue?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-center py-6">
              <Badge
                variant={
                  loanData.loanStatus === "approved" ? "success" : "destructive"
                }
                className="text-lg px-6 py-3"
              >
                {loanData.loanStatus === "approved"
                  ? "✅ LOAN APPROVED"
                  : "❌ LOAN REJECTED"}
              </Badge>
              <p className="mt-4 text-muted-foreground">
                {loanData.loanStatus === "approved"
                  ? "Your loan has been approved and will be distributed to your wallet shortly."
                  : "Your collateral value is insufficient. Please provide additional collateral or reduce the loan amount."}
              </p>
            </div>

            {loanData.loanStatus === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Loan Repayment Terms
                  </CardTitle>
                  <CardDescription>
                    Review the repayment schedule and terms for your loan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Interest Rate
                      </p>
                      <p className="text-2xl font-bold text-primary">8.5%</p>
                      <p className="text-xs text-muted-foreground">
                        Annual Rate
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Loan Term
                      </p>
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">Months</p>
                    </div>
                    <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Monthly EMI
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        $
                        {Math.round(
                          (parseInt(loanData.requestedAmount) * 1.085) / 24
                        ).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fixed Amount
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total EMIs
                      </p>
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">Payments</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold mb-3">Repayment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Principal Amount:</span>
                        <span className="font-medium">
                          ${parseInt(loanData.requestedAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-medium">
                          $
                          {Math.round(
                            parseInt(loanData.requestedAmount) * 0.085
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="font-semibold">Total Repayment:</span>
                        <span className="font-semibold">
                          $
                          {Math.round(
                            parseInt(loanData.requestedAmount) * 1.085
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
                    <p className="text-sm text-info-foreground">
                      <strong>Important:</strong> Missing 3 consecutive EMI
                      payments may result in collateral liquidation as per smart
                      contract terms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            {loanData.loanStatus === "approved" && (
              <div className="p-4 bg-gradient-success rounded-lg text-success-foreground">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Loan amount will be transferred to your wallet</li>
                  <li>• Smart contract will hold your collateral</li>
                  <li>• Begin repayment as per terms</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
