import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import Index from "./pages/Index.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from './pages/Auth.tsx'
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import './index.css'

// Survey registration - Admin only
const SurveyApp = () => (
  <AdminRoute>
    <App initialState="survey" />
  </AdminRoute>
);

// Scanner - Any authenticated user
const ScannerApp = () => (
  <ProtectedRoute>
    <App initialState="scanner" />
  </ProtectedRoute>
);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/survey" element={<SurveyApp />} />
      <Route path="/scanner" element={<ScannerApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
