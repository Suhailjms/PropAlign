
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

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message,
      });
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ProposerAILogo className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl font-bold">ProposerAI</CardTitle>
          </div>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
        </CardContent>
      </Card>
    </main>
  );
}
