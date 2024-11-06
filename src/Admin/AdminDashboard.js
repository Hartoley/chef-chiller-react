import React, { useState } from "react";
import Admin from "./Admin";
import Footer from "./Footer";
import AdminSideNav from "./AdminSideNav";

const AdminDashboard = () => {
  const [isLoggedIn, setisLoggedIn] = useState(true);

  return (
    <>
      <AdminSideNav />
    </>
  );
};

export default AdminDashboard;
