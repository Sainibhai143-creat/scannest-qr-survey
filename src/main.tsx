import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import Index from "./pages/Index.tsx";
import { QRScanner } from "./components/qr/QRScanner";
import Auth from './pages/Auth.tsx'
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import './index.css'

// Create wrapper components for different states
const SurveyApp = () => (
  <ProtectedRoute>
    <App initialState="survey" />
  </ProtectedRoute>
);

const ScannerApp = () => (
  <ProtectedRoute>
    <App initialState="scanner" />
  </ProtectedRoute>
);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/survey" element={<SurveyApp />} />
      <Route path="/scanner" element={<ScannerApp />} />
    </Routes>
  </BrowserRouter>
);
