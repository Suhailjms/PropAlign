
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProposerAILogo from '@/components/ProposerAILogo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type LoginStep = 'credentials' | 'mfa';

export default function LoginPage() {
  const { login, completeLogin } = useAuth();
  const { toast } = useToast();
  
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.mfaRequired) {
        setLoginStep('mfa');
      }
      // If not MFA required, the login function handles the redirect, so no action needed here.
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message,
      });
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (mfaCode === '123456') {
      const success = await completeLogin(email);
      if (success) {
        toast({
          title: "Login Successful",
          description: "You have been securely logged in.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "MFA Failed",
          description: "An unexpected error occurred. Please try logging in again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MFA Failed",
        description: "The one-time code is incorrect. Please try again.",
      });
    }
    setLoading(false);
  };
  
  const handleBackToLogin = () => {
    setLoginStep('credentials');
    setPassword('');
    setMfaCode('');
  }


  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ProposerAILogo className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl font-bold">ProposerAI</CardTitle>
          </div>
           <CardDescription>
            {loginStep === 'credentials' 
              ? 'Enter your credentials to sign in' 
              : 'Enter the code from your authenticator app'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginStep === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log in
              </Button>
              <div className="text-center text-xs text-muted-foreground mt-4 space-y-1">
                  <p className='font-semibold'>Use one of the pre-configured accounts:</p>
                  <p>admin@proposer.ai / password123</p>
                  <p>manager@proposer.ai / password123</p>
                  <p>approver@proposer.ai / password123</p>
                  <p>etc. (viewer, editor, reviewer)</p>
              </div>
            </form>
          )}

          {loginStep === 'mfa' && (
            <form onSubmit={handleMfaSubmit} className="grid gap-4">
              <Alert>
                <AlertTitle>Check your authenticator app</AlertTitle>
                <AlertDescription>
                  A 6-digit code has been sent to your device. The simulated code is <strong>123456</strong>.
                </AlertDescription>
              </Alert>
              <div className="grid gap-2">
                <Label htmlFor="mfa">6-Digit Code</Label>
                <Input
                  id="mfa"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
              <Button variant="link" size="sm" onClick={handleBackToLogin} className="font-normal">
                Back to login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
