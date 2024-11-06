import React, { useState } from "react";

const Admin = ({ signup, signin, isLoggedIn, isDashboard }) => {
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
            <span class="material-symbols-outlined">menu</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Admin;
