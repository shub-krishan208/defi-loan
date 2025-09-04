import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend signup
    console.log("Signing up:", { username, email, password });
    navigate("/login");
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
          Create your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name_123"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

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
            Sign up
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-center items-center mt-4 text-sm">
          <span className="text-muted-foreground mr-1">
            Already have an account?
          </span>
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
