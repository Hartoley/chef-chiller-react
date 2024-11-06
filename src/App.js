import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "./Admin/Admin";
import AdminLoginPage from "./Admin/AdminLoginPage";
import AdminSignup from "./Admin/AdminSignup";
import LandingPage from "./Admin/LandingPage";
import SignupForm from "./Admin/SignupForm";
import UserDashboard from "./Admin/UserDashboard";
import AdminDashboard from "./Admin/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/signin" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/user/signup" element={<SignupForm />} />
        <Route path="/user/dashboard/:id" element={<UserDashboard />} />
        <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
