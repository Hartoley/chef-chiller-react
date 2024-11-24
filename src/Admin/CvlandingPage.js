import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import "./cv.css"; // Custom styles

const CvLandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Close menu after scrolling
    }
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

          {/* Dark Mode Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              className="mr-4 p-2 rounded-md transition-all duration-300 focus:outline-none"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="text-2xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>

          {/* Desktop Navigation */}
          <div
            className={`lg:flex items-center space-x-6 hidden ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {["home", "about-me", "skills", "contact-me"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-sm font-medium hover:text-blue-500 dark:hover:text-blue-300"
              >
                {section.replace("-", " ").toUpperCase()}
              </button>
            ))}
            <button
              className="ml-4 p-2 rounded-md transition-all duration-300 focus:outline-none"
              onClick={toggleDarkMode}
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden ${
            menuOpen ? "block" : "hidden"
          } bg-purple-200 dark:bg-purple-800 py-4 transition-all duration-300`}
        >
          <div className="container mx-auto flex flex-col space-y-4 items-center">
            {["home", "about-me", "skills", "contact-me"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-sm font-medium hover:text-blue-500 dark:hover:text-blue-300"
              >
                {section.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section
        id="home"
        className={`${
          darkMode
            ? "bg-purple-900 text-gray-50"
            : "bg-purple-100 text-purple-900"
        } text-center py-20 transition-colors duration-500`}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Hello, I'm{" "}
            <span
              className={`${darkMode ? "text-pink-500" : "text-purple-600"}`}
            >
              Jimoh Sekinat Tolani
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-6">
            Full-Stack Web Application Developer
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="#contact"
              className={`${
                darkMode
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              } py-2 px-6 rounded-lg text-lg font-medium transition duration-300`}
            >
              Contact Me
            </a>
            <a
              href="path-to-cv.pdf"
              download
              className={`${
                darkMode
                  ? "bg-gray-800 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  : "bg-purple-200 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              } py-2 px-6 rounded-lg text-lg font-medium transition duration-300`}
            >
              Download CV
            </a>
          </div>
        </div>
      </section>

      <section
        id="about-me"
        className={`${
          darkMode
            ? "bg-purple-900 text-gray-300"
            : "bg-purple-100 text-gray-800"
        } container mx-auto py-16 px-6 focus:outline-none`}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">About Me</h2>
        <div className="max-w-3xl mx-auto text-lg leading-relaxed">
          <p className="mb-4">
            I’m a Full Stack Web Application Developer with over 4 years of
            experience in creating modern, responsive, and scalable software
            solutions. My expertise lies in delivering robust and intuitive web
            applications, specializing in fintech, education, and e-commerce
            domains.
          </p>
          <p className="mb-4">
            With a passion for learning and solving challenges, I transform
            creative ideas into digital realities. My strengths include
            creativity, problem-solving, and a commitment to delivering
            high-quality results for exceptional user experiences.
          </p>
          <p className="font-semibold mt-6">My areas of expertise include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Full Stack Development</li>
            <li>Frontend Development</li>
            <li>Backend Logic and API Development</li>
            <li>Database Architecture</li>
          </ul>
          <p className="mt-6">
            I look forward to collaborating on your next project to bring your
            vision to life!
          </p>
        </div>
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
