import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import AuthLanding from "./pages/AuthLanding.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import './index.css'

// Create wrapper components for different states
const SurveyApp = () => <App initialState="survey" />;
const ScannerApp = () => <App initialState="scanner" />;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/survey" element={<SurveyApp />} />
      <Route path="/scanner" element={<ScannerApp />} />
    </Routes>
  </BrowserRouter>
);
