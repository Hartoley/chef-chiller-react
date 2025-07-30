import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Admin = ({ signup, signin, isDashboard }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    setShowMenu((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("id");
    window.location.href = "/user/signin";
  };

  const goToDash = () => {
    id ? navigate(`/user/dashboard/${id}`) : navigate("/user/signin");
  };

  const home = () => navigate("/");

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) setIsLoggedIn(true);
  }, []);

  Admin.home = home;
  Admin.goToDash = goToDash;

  return (
    <nav className="w-full fixed z-20 h-[16vh] bg-[#040e19] flex items-center px-4 sm:px-8">
      <div className="flex items-center justify-between w-full h-full">
        {/* Logo */}
        <div
          onClick={home}
          className="flex items-center gap-2 cursor-pointer h-full"
        >
          <img
            src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
            alt="logo"
            className="rounded-full h-10 w-10 object-cover"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden h-full md:flex items-center gap-6 text-white font-medium text-sm sm:text-base lg:text-[15px]">
          {["Our Menu", "Blogs", "Features", "Pages", "Contact Us"].map(
            (item, idx) => (
              <p
                key={idx}
                className="flex items-center gap-1 hover:text-green-600 cursor-pointer"
              >
                {item}
                {item !== "Contact Us" && (
                  <span className="material-symbols-outlined text-sm">
                    keyboard_arrow_down
                  </span>
                )}
              </p>
            )
          )}
        </div>

        {/* Buttons */}
        {!isDashboard && !isLoggedIn ? (
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={signup}
              className="bg-[#cc0f31] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#4fb354] transition-transform transform hover:scale-110"
            >
              Join us
            </button>
            <button
              onClick={signin}
              className="bg-[#fc9e34] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#4fb354] transition-transform transform hover:scale-110"
            >
              Login
            </button>
          </div>
        ) : (
          isLoggedIn && (
            <div className="hidden md:flex items-center">
              <button
                onClick={logout}
                className="bg-[#fc9e34] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#f65553] transition-transform transform hover:scale-110"
              >
                Log out
              </button>
            </div>
          )
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <span
            onClick={toggleMenu}
            className="material-symbols-outlined text-white text-3xl cursor-pointer"
          >
            menu
          </span>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {showMenu && (
        <div className="absolute top-[12vh] left-4 right-4 bg-white text-gray-800 p-5 border border-gray-300 shadow-xl z-50 rounded-xl transition-all animate-fade-in">
          <div className="mb-3 pb-2 border-b border-gray-200">
            <h4 className="text-base font-semibold">Welcome</h4>
            <p className="text-xs text-gray-500">Choose your next step</p>
          </div>

          <div
            onClick={signup}
            className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-md hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-600 text-xl">
              face
            </span>
            <div>
              <p className="text-sm font-medium">Join us</p>
              <p className="text-[11px] text-gray-500">
                Create your free account
              </p>
            </div>
          </div>

          <div
            onClick={signin}
            className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-md hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-600 text-xl">
              passkey
            </span>
            <div>
              <p className="text-sm font-medium">Log in</p>
              <p className="text-[11px] text-gray-500">Access your dashboard</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Admin;
