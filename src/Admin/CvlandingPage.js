import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import "./cv.css"; // Your custom styles

const CvLandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${
        darkMode ? "bg-purple-900 text-gray-100" : "bg-purple-100 text-gray-900"
      } min-h-screen transition-colors duration-500`}
    >
      {/* Navbar */}
      <nav
        className={`${
          darkMode ? "bg-purple-800" : "bg-purple-300"
        } sticky top-0 z-50 shadow-md transition-colors duration-500`}
      >
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">My CV</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="text-2xl p-2 rounded-md transition-all duration-300 focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="container mx-auto py-20 text-center focus:outline-none"
      >
        <h1 className="text-5xl font-extrabold mb-4">Welcome to My CV</h1>
        <p className="text-lg">
          Discover my journey and learn about my skills, experiences, and
          passions.
        </p>
      </section>

      {/* About Me */}
      <section
        id="about-me"
        className={`${
          darkMode ? "bg-purple-800 text-gray-200" : "bg-purple-200"
        } container mx-auto py-16 px-4 focus:outline-none`}
      >
        <h2 className="text-4xl font-semibold mb-4 text-center">About Me</h2>
        <p className="text-center max-w-2xl mx-auto leading-relaxed">
          Hi! I'm a passionate web developer who loves to bring ideas to life
          through clean, functional, and aesthetic web designs. I enjoy
          exploring new technologies and continuously improving my craft.
        </p>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="container mx-auto py-16 px-4 focus:outline-none"
      >
        <h2 className="text-4xl font-semibold mb-6 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Tailwind",
            "MongoDB",
            "REST APIs",
          ].map((skill) => (
            <div
              key={skill}
              className={`p-4 rounded-md shadow-lg ${
                darkMode
                  ? "bg-purple-700 hover:bg-purple-600"
                  : "bg-purple-300 hover:bg-purple-400"
              } transition-all duration-300`}
            >
              <span className="font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Me */}
      <section
        id="contact-me"
        className={`${
          darkMode ? "bg-purple-800 text-gray-200" : "bg-purple-200"
        } container mx-auto py-16 px-4 focus:outline-none`}
      >
        <h2 className="text-4xl font-semibold mb-4 text-center">Contact Me</h2>
        <p className="text-center max-w-2xl mx-auto leading-relaxed">
          Have a project in mind or just want to say hi? Feel free to reach out
          to me at{" "}
          <span
            className={`font-medium ${
              darkMode ? "text-purple-300" : "text-purple-700"
            }`}
          >
            example@example.com
          </span>
          .
        </p>
      </section>

      {/* Footer */}
      <footer
        className={`${
          darkMode ? "bg-purple-900 text-gray-400" : "bg-purple-300"
        } text-center py-6 transition-colors duration-500`}
      >
        <p>&copy; {new Date().getFullYear()} My CV. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default CvLandingPage;
