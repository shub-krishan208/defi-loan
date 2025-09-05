import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Signup } from "./Signup";

import { useToast } from "@/hooks/use-toast";

type LoginProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken && !isLoggedIn) {
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (!res.ok) {
        let errMsg = "Invalid credentials";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
          console.error("server response: ", errMsg);
        } catch (err) {
          console.error("Error while logging in: ", err);
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      toast({
        title: "Login Successful",
        description: "Welcome back! You have been logged in.",
      });
      console.log("User logged in Successfully!");
      setIsLoggedIn(true);
      return isLoggedIn;
    }

    if (authToken.startsWith("Bearer")) {
      toast({
        title: "Logged in Session.",
        description: "You're already logged in!",
      });
      console.log("User already logged in!");
      setIsLoggedIn(true);
      return isLoggedIn;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend login
    handleLogin();
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-lg">
            DeFi
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          Sign in to your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full transition-all duration-200"
          >
            Sign in
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
          <Link to="/signup" className="text-primary hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export { Login };
