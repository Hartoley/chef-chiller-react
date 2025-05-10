import React, { useState, useEffect } from "react";
import "../Admin/adminsidenav.css";
import { useNavigate } from "react-router-dom";

const Admin = ({ signup, signin, isDashboard }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const id = JSON.parse(localStorage.getItem("id"));
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
    const id = JSON.parse(localStorage.getItem("id"));
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

  console.log(isLoggedIn);

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
      <nav className="navbar">
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
                className="text-black"
                id="overrideZIndex"
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  left: "60vw",
                  width: "40vw",
                  height: "auto",
                  fontSize: "14px",
                  lineHeight: "20px",
                  padding: "10px 15px",
                  border: "solid 0.5px rgb(135, 137, 138)",
                  top: "10vh",
                  zIndex: "10",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  onClick={signup}
                  style={{
                    marginTop: "15px",
                    cursor: "pointer",
                    transition: "color 0.3s, transform 0.3s",
                    fontSize: "12px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ff4d4d";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Join us
                  <span
                    style={{
                      fontSize: "10px",
                    }}
                    className="material-symbols-outlined"
                  >
                    face
                  </span>
                </div>

                <div
                  onClick={signin}
                  style={{
                    marginTop: "15px",
                    cursor: "pointer",
                    transition: "color 0.3s, transform 0.3s",
                    fontSize: "12px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ff4d4d";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Log in
                  <span
                    style={{
                      fontSize: "10px",
                    }}
                    className="material-symbols-outlined"
                  >
                    passkey
                  </span>
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
