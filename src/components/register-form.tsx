
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CertiCheckLogo } from "./icons";
import { Loader2 } from "lucide-react";


export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"User" | "Institution">("User");
  const [isLoading, setIsLoading] = React.useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await register({ email, password, role });
    
    if (result.success) {
      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      });
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.message,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <CertiCheckLogo className="w-12 h-12 text-primary mb-2" />
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
           <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup 
                defaultValue="User" 
                className="flex gap-4 pt-1" 
                value={role} 
                onValueChange={(value: "User" | "Institution") => setRole(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="User" id="role-user" />
                <Label htmlFor="role-user">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Institution" id="role-institution" />
                <Label htmlFor="role-institution">Institution</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
           <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
