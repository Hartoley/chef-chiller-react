import React, { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import "./cv.css";
import axios from "axios";
import Titter from "../Images/twitter2-removebg-preview.png";
import linkdin from "../Images/linkedin2-removebg-preview.png";
import whatsapp from "../Images/whatsapp-removebg-preview.png";
import telegram from "../Images/images-removebg-preview.png";
import io from "socket.io-client";

const socket = io("http://localhost:5010");

const CvLandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsId, setProjectsId] = useState([]);
  const [error, setError] = useState("");
  const [pId, setPId] = useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showProject = (id) => {
    setPId(id);
    console.log(id);

    const fetchProjectsId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5010/fetchproject/${pId}`
        );
        setProjectsId(response.data);
        console.log("Project data fetched:", response);
        setIsModalOpen(true);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      }
    };
    fetchProjectsId();
    // console.log(projectsId);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5010/getallproject");
        setProjects(response.data);
        console.log(response);
      } catch (err) {
        setError("Failed to load projects");
        console.pId(err);
      }
    };

    fetchProjects();

    socket.on("newProject", (newProject) => {
      setProjects((prevProjects) => [newProject, ...prevProjects]);
    });

    return () => {
      socket.off("newProject");
    };
  }, []);

  const skills = [
    {
      category: "Front-End",
      items: ["HTML", "CSS", "Bootstrap", "React", "TailWind", "Angular"],
    },
    {
      category: "Back-End",
      items: ["PHP", "Laravel", "Node.js"],
    },
    {
      category: "Database",
      items: ["MySQL", "MongoDB"],
    },
  ];
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
        darkMode
          ? "bg-purple-900 text-gray-100"
          : "bg-purple-100 text-purple-700"
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

          {/* Dark Mode Toggle and Mobile Menu Toggle */}
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
            className={`hidden lg:flex items-center space-x-6 ${
              darkMode ? "text-gray-100" : "text-purple-700"
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

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden fixed top-[12vh] right-0 h-[40vh] w-[40vw] py-4 shadow-md z-50 transform transition-transform duration-500 ease-in-out ${
            darkMode
              ? "bg-purple-800 text-gray-50"
              : "bg-purple-200 text-purple-900"
          } ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="container mx-auto flex flex-col space-y-6 items-start">
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
      {/* <div className=" z-50 bg-purple-950 w-full h-[100vh] fixed top-0 bg-opacity-50 left-0"></div> */}

      {isModalOpen && projectsId && (
        <div className="z-50 bg-purple-950 w-full h-[100vh] fixed top-0 bg-opacity-50 left-0 flex items-center justify-center">
          <div className="bg-purple-900 w-[90vw] max-w-[600px] text-white rounded-lg shadow-lg p-6 relative">
            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-4 border-b-2 border-blue-700 pb-2">
              {projectsId.title} ({projectsId.status})
            </h2>

            {/* Project Summary */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Project Summary
              </h3>
              <p className="text-sm leading-relaxed">
                {projectsId.description}
              </p>
              <ul className="list-disc list-inside mt-2 text-sm">
                {projectsId.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Technologies Used */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Technology Used
              </h3>
              <p className="text-sm">{projectsId.technologies.join(", ")}</p>
            </div>

            {/* Live Demo and Close */}
            <div className="flex justify-between items-center">
              {projectsId.liveDemoLink && (
                <button
                  className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                  onClick={() => window.open(projectsId.liveDemoLink, "_blank")}
                >
                  See Live Demo
                </button>
              )}
              <button
                className="border border-blue-700 text-blue-400 hover:text-blue-600 hover:border-blue-600 text-sm px-4 py-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section
        id="home"
        className={`${
          darkMode
            ? "bg-purple-900 text-gray-50"
            : "bg-purple-100 text-purple-900"
        } text-center py-10 md:py-20 transition-colors duration-500`}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4">
            Hello, I'm{" "}
            <span
              className={`${darkMode ? "text-pink-500" : "text-purple-600"}`}
            >
              Jimoh Sekinat Tolani
            </span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6">
            Full-Stack Web Application Developer
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <p
              className={`${
                darkMode
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              } py-2 px-6 rounded-lg text-base sm:text-lg font-medium transition duration-300`}
            >
              Contact Me
            </p>
            <p
              download
              className={`${
                darkMode
                  ? "bg-gray-800 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  : "bg-purple-200 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              } py-2 px-6 rounded-lg text-base sm:text-lg font-medium transition duration-300`}
            >
              Download CV
            </p>
          </div>
        </div>
      </section>

      <section
        id="about-me"
        className={`${
          darkMode
            ? "bg-purple-900 text-gray-300"
            : "bg-purple-100 text-purple-700"
        } container mx-auto py-16 px-6 focus:outline-none`}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">About Me</h2>
        <div className="max-w-3xl mx-auto text-lg leading-relaxed">
          <p className="mb-6">
            Hello! I’m a budding Full Stack Web Developer with over a year of
            experience in building dynamic, responsive, and user-friendly web
            applications. My journey in software development is fueled by a deep
            passion for learning, creativity, and bringing ideas to life through
            clean and functional code.
          </p>
          <p className="mb-6">
            As someone who is constantly exploring the world of web
            technologies, I’ve gained hands-on experience with modern
            development tools and techniques, creating solutions for small-scale
            projects and refining my skills every day.
          </p>
          <p className="font-semibold mb-4">
            Here’s what I’m currently focusing on:
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Developing full stack applications using modern tools</li>
            <li>Enhancing front-end designs with responsive layouts</li>
            <li>Building backend logic and APIs to power applications</li>
            <li>Continuously improving my database management skills</li>
          </ul>
          <p>
            I’m excited to grow and contribute to projects that push me to
            improve and deliver value. Let’s build something amazing together!
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className={`py-16 px-10 ${
          darkMode
            ? "bg-purple-800 text-white"
            : "bg-purple-300 text-purple-700"
        }`}
      >
        <h2 className="text-4xl font-bold mb-8 text-center">My Skills</h2>
        <div className="grid md:grid-cols-3 p-6 gap-8">
          {skills.map((skillCategory, index) => (
            <div key={index}>
              <h3
                className={`text-2xl font-semibold mb-6 ${
                  darkMode ? "text-purple-200" : "text-purple-900"
                }`}
              >
                {skillCategory.category}
              </h3>
              <div className="space-y-4">
                {skillCategory.items.map((skill, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg shadow-md ${
                      darkMode
                        ? "bg-purple-700 hover:bg-purple-600"
                        : "bg-purple-100 hover:bg-purple-200"
                    } transition-all duration-300`}
                  >
                    <h4 className="text-lg font-medium">{skill}</h4>
                    <p className="text-sm">
                      {["Experienced", "Expert"][i % 2]}{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Projects Section */}
      <section
        id="projects"
        className={`py-16 px-6 ${
          darkMode
            ? "bg-purple-900 text-purple-200"
            : "bg-purple-200 text-purple-700"
        }`}
      >
        <h2
          className={`text-4xl font-bold mb-12 text-center ${
            darkMode ? "text-purple-200" : "text-purple-700"
          }`}
        >
          Projects
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {projects.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="relative w-full max-w-xs md:max-w-sm lg:max-w-md h-[300px] rounded-lg shadow-lg overflow-hidden"
              >
                {/* Background Image */}
                <img
                  src={`http://localhost:5010/${project.image}`}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay for Details */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 ${
                    darkMode ? "text-gray-300" : "text-white"
                  }`}
                >
                  {/* Project Title */}
                  <h3 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h3>

                  {/* Button */}
                  <button
                    onClick={() => showProject(project._id)}
                    className={`text-sm font-medium py-2 px-4 rounded bg-opacity-50 ${
                      darkMode
                        ? "bg-purple-600 hover:bg-purple-500"
                        : "bg-purple-500 hover:bg-purple-400"
                    } text-white`}
                  >
                    Click to see this project info & link
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No projects available. Stay tuned!
          </p>
        )}
      </section>

      {/* Contact Me */}
      <section
        id="contact-me"
        className={`container mx-auto py-16 px-4 transition-all duration-300 ${
          darkMode
            ? "bg-purple-700 text-gray-200"
            : "bg-purple-200 text-purple-700"
        }`}
      >
        <h2 className="text-4xl font-semibold text-center mb-8">Contact Me</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="text-lg flex items-center space-x-4 gap-2">
              <span className="text-2xl">📍</span>
              {/* <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src={Titter}
                alt=""
              /> */}
              <p className="font-medium m-0 p-0">Nigeria</p>
            </div>
            <div className="text-lg flex items-center space-x-4 gap-2">
              <span className="text-2xl">✉️</span>
              <p className="font-medium p-0 m-0">tolanijimoh1@gmail.com</p>
            </div>
            <div className="text-lg flex items-center space-x-4 gap-2">
              <span className="text-2xl">📞</span>
              <p className="font-medium p-0 m-0">+2348024219945</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Connect With Me:</p>
              <div className="flex space-x-4 text-2xl">
                {/* Twitter Icon */}
                <a
                  href="https://twitter.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    src={Titter} // Make sure to import your Twitter image correctly
                    alt="Twitter"
                  />
                </a>

                {/* LinkedIn Icon */}
                <a
                  href="https://www.linkedin.com/in/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    src={linkdin} // Make sure to import your LinkedIn image correctly
                    alt="LinkedIn"
                  />
                </a>

                {/* WhatsApp Icon */}
                <a
                  href="https://wa.me/your-phone-number"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    src={whatsapp} // Make sure to import your WhatsApp image correctly
                    alt="WhatsApp"
                  />
                </a>

                {/* Telegram Icon */}
                <a
                  href="https://t.me/your-telegram-username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                    src={telegram} // Make sure to import your Telegram image correctly
                    alt="Telegram"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <textarea
                rows="4"
                placeholder="Message"
                className="w-full p-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white p-3 rounded-md shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${
          darkMode
            ? "bg-purple-900 text-gray-400"
            : "bg-purple-300 text-purple-700"
        } text-center py-6 transition-colors duration-500`}
      >
        <p className="mb-2">Sekinat Tolani Jimoh</p>
        <div className="flex justify-center gap-4 mb-2">
          <div className="flex space-x-4 text-2xl">
            {/* Twitter Icon */}
            <a
              href="https://twitter.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src={Titter} // Make sure to import your Twitter image correctly
                alt="Twitter"
              />
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/your-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src={linkdin} // Make sure to import your LinkedIn image correctly
                alt="LinkedIn"
              />
            </a>

            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/your-phone-number"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src={whatsapp} // Make sure to import your WhatsApp image correctly
                alt="WhatsApp"
              />
            </a>

            {/* Telegram Icon */}
            <a
              href="https://t.me/your-telegram-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src={telegram} // Make sure to import your Telegram image correctly
                alt="Telegram"
              />
            </a>
          </div>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Keenah. All Rights Reserved.
        </p>
        <p className="text-sm">
          Designed & Developed by <strong>Sekinat Tolani Jimoh</strong>
        </p>
      </footer>
    </div>
  );
};

export default CvLandingPage;
