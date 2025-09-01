import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";
import heroImage from "@/assets/defi-hero.jpg";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/*
       Hero Section 
      @dev random shit
      */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              DeFi{" "}
              <span className="bg-gradient-text bg-clip-text text-transparent font-extrabold">
                Lending
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Secure blockchain-based loans with transparent smart contracts and
              competitive rates
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                ✅ Instant approval process
              </span>
              <span className="flex items-center gap-2">
                ✅ Competitive interest rates
              </span>
              <span className="flex items-center gap-2">
                ✅ Secure smart contracts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section, data from database will be used here. */}
      <div className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Active Borrowers Dashboard
            </h2>
            <p className="text-muted-foreground">
              Real-time overview of all current loans in the system
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-background rounded-lg border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">
                    Public Address
                  </th>
                  <th className="text-left p-4 font-semibold">
                    Remaining Amount
                  </th>
                  <th className="text-left p-4 font-semibold">Next Due Date</th>
                  <th className="text-left p-4 font-semibold">
                    Failed Payments
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* @dev Add the data from database here to create cells*/}
                <tr className="border-b border-border/50">
                  <td className="p-4 font-mono text-sm">0x742d...7A9B</td>
                  <td className="p-4">$12,500 ETH</td>
                  <td className="p-4">2024-09-15</td>
                  <td className="p-4">
                    <span className="text-success">0 months</span>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-4 font-mono text-sm">0x8f3c...4D2E</td>
                  <td className="p-4">$8,200 ETH</td>
                  <td className="p-4">2024-09-12</td>
                  <td className="p-4">
                    <span className="text-warning">1 month</span>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-4 font-mono text-sm">0x1a5f...8C9D</td>
                  <td className="p-4">$25,000 ETH</td>
                  <td className="p-4">2024-09-20</td>
                  <td className="p-4">
                    <span className="text-success">0 months</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-sm">0x6e2b...5F8A</td>
                  <td className="p-4">$3,800 ETH</td>
                  <td className="p-4">2024-09-08</td>
                  <td className="p-4">
                    <span className="text-destructive">3 months</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!walletAddress ? (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Get Started</h2>
                <p className="text-muted-foreground">
                  Connect your wallet to begin the loan application process
                </p>
              </div>
              <WalletConnect onWalletConnected={setWalletAddress} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Loan Application</h2>
                <p className="text-muted-foreground">
                  Complete the steps below to apply for your loan
                </p>
              </div>
              <LoanApplicationForm walletAddress={walletAddress} />
            </div>
          )}
        </div>
      </div>

      {/* Features Section or FOOTER*/}
      <div className="bg-gradient-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Why Choose Our Platform?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of lending with our blockchain-powered
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold">Secure & Transparent</h4>
              <p className="text-muted-foreground">
                Smart contracts ensure transparency and security for all
                transactions
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold">Instant Processing</h4>
              <p className="text-muted-foreground">
                Get loan approval in minutes, not days with our automated system
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-semibold">Competitive Rates</h4>
              <p className="text-muted-foreground">
                Enjoy lower interest rates powered by DeFi protocols
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
