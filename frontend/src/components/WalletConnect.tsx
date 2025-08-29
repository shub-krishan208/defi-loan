import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
}

export const WalletConnect = ({ onWalletConnected }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          onWalletConnected(address);
        }
      } else {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl">Connect Wallet</CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to start borrowing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletAddress ? (
          <div className="text-center space-y-4">
            <Badge variant="success" className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Wallet Connected
            </Badge>
            <p className="text-sm text-muted-foreground">
              Connected to: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              variant="wallet"
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect MetaMask
                </>
              )}
            </Button>
            
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};