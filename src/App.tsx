
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "./utils/authentication";
import { initializeDemoData } from "./utils/initialData";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import InvestigatorLogin from "./pages/InvestigatorLogin";
import AdminDashboard from "./pages/AdminDashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import NotFound from "./pages/NotFound";
import React, { useEffect } from "react";

// Initialize demo data
initializeDemoData();

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  element, 
  requiredRole 
}: { 
  element: JSX.Element, 
  requiredRole?: 'admin' | 'investigator' 
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/investigator/dashboard" replace />;
  }

  return element;
};

const App = () => {
  useEffect(() => {
    // Ensure demo data is initialized
    initializeDemoData();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/investigator/login" element={<InvestigatorLogin />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/admin/dashboard" 
                element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
              />
              <Route 
                path="/investigator/dashboard" 
                element={<ProtectedRoute element={<InvestigatorDashboard />} />} 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
