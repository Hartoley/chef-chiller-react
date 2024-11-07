import React, { useState } from "react";
import "../Admin/adminsidenav.css";

const Admin = ({ signup, signin, isLoggedIn, isDashboard }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showMenu, setshowMenu] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    setshowMenu((prev) => !prev);
  };
  const logout = () => {};

  return (
    <>
      <nav>
        <div className="dropDown">
          <div className="image">
            <img
              class="logo"
              src="https://i.pinimg.com/236x/72/e2/84/72e284c245a1ba8817265f69ff8d65d7.jpg"
              alt=""
            />
          </div>
          <div className="contentMain">
            {!isDashboard && !isLoggedIn && (
              <>
                <button onClick={signup} className="buttonSignup">
                  Join us
                </button>
                <button onClick={signin} className="buttonLogin">
                  Login
                </button>
              </>
            )}
            <div className="content1">
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
            <div className="buttonBox">
              {isLoggedIn && (
                <button onClick={signin} className="buttonLogin">
                  Log out
                </button>
              )}
            </div>
          </div>
          <div className="buttonBox1">
            <span onClick={toggleMenu} class="material-symbols-outlined">
              menu
            </span>
            {showMenu && (
              <div
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
