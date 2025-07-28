import React, { useState, useEffect } from "react";
import "../Admin/adminsidenav.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Admin = ({ signup, signin, isDashboard }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu((prev) => !prev);
  };
  const logout = () => {
    localStorage.removeItem("id");

    window.location.href = "/user/signin";
  };

  const goToDash = () => {
    if (id) {
      console.log(id);

      navigate(`/user/dashboard/${id}`);
    } else {
      navigate("/user/signin");
    }
  };

  const home = () => {
    navigate("/");
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setIsLoggedIn(true); // Set to true if `id` exists in localStorage
    }
  }, []);

  Admin.home = home;
  Admin.goToDash = goToDash;

  return (
    <>
      <nav className="mynavbar">
        <div className="dropDown flex-shrink-0 !pl-4">
          <div
            onClick={home}
            className="image1 flex items-center justify-center rounded-full"
          >
            <img
              class="logo"
              className="rounded-full flex-shrink-0 h-10 w-10"
              src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
              alt=""
            />
          </div>
          <div className="contentMain w-[90%] h-full gap-[5vw] flex items-center justify-between">
            <div className="content1 w-[50%]">
              <p>
                Our Menu
                <span class="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </p>
              <p>
                Blogs
                <span class="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </p>
              <p>
                Features
                <span class="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </p>
              <p>
                Pages
                <span class="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </p>
              <p>Contact Us</p>
            </div>
            {!isDashboard && !isLoggedIn && (
              <div className="flex h-full w-[30%] items-start justify-between ">
                <>
                  <button onClick={signup} className="buttonSignup">
                    Join us
                  </button>
                  <button onClick={signin} className="buttonLogin">
                    Login
                  </button>
                </>
              </div>
            )}
            {isLoggedIn && (
              <div className="buttonBox">
                <button onClick={logout} className="buttonLogin">
                  Log out
                </button>
              </div>
            )}
          </div>
          <div className="buttonBox1">
            <span onClick={toggleMenu} class="material-symbols-outlined">
              menu
            </span>
            {showMenu && (
              <div
                id="overrideZIndex"
                className="absolute top-[10vh] left-[10vw] w-[280px] sm:w-[320px] bg-white text-gray-800 p-5 border border-gray-300 shadow-xl z-50 rounded-xl transition-all duration-300 animate-fade-in"
              >
                {/* Header */}
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <h4 className="text-base font-semibold">Welcome</h4>
                  <p className="text-xs text-gray-500">Choose your next step</p>
                </div>

                {/* Action: Join us */}
                <div
                  onClick={signup}
                  className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-md hover:bg-gray-100 transition-all"
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

                {/* Action: Login */}
                <div
                  onClick={signin}
                  className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-md hover:bg-gray-100 transition-all"
                >
                  <span className="material-symbols-outlined text-gray-600 text-xl">
                    passkey
                  </span>
                  <div>
                    <p className="text-sm font-medium">Log in</p>
                    <p className="text-[11px] text-gray-500">
                      Access your dashboard
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Admin;
