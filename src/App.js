import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "./Admin/Admin";
import AdminLoginPage from "./Admin/AdminLoginPage";
import AdminSignup from "./Admin/AdminSignup";
import LandingPage from "./Admin/LandingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/signin" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
      </Routes>
    </>
  );
}

export default App;
