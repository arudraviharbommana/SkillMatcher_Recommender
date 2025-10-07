import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storageUtils } from "@/utils/storage";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthFormProps {
  onSuccess: (user: User) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storageUtils.getUsers();
    const user = users.find(u => u.email === loginEmail);

    if (user && user.password === loginPassword) {
      storageUtils.setCurrentUser(user);
      toast.success(`Welcome back, ${user.username}!`);
      onSuccess(user);
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storageUtils.getUsers();
    const existingUser = users.find(u => u.email === signupEmail);

    if (existingUser) {
      toast.error("User already exists. Please login instead.");
      return;
    }

    const newUser: User = {
      email: signupEmail,
      username: signupUsername,
      password: signupPassword,
    };

    storageUtils.saveUser(newUser);
    storageUtils.setCurrentUser(newUser);
    toast.success(`Account created! Welcome, ${signupUsername}!`);
    onSuccess(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-lg shadow-strong p-6">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold">SkillMatcher</CardTitle>
          <CardDescription className="text-lg">Analyze your resume and match it with job descriptions</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-base">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password"className="text-base">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-base">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Your name"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-base">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-base">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
