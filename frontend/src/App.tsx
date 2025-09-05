import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Login } from "./components/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Signup } from "./components/Signup";
import { useState } from "react";

const queryClient = new QueryClient();

type LoginProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index isLoggedIn={isLoggedIn} />} />
            <Route
              path="/login"
              element={
                <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route path="/signup" element={<Signup />} />

            {/* Fall back page for path not found*/}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
