import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("https://chef-chiller-node.onrender.com");

socket.on("message", (message) => {
  // console.log("Message from server:", message);
});

socket.emit("message", "Hello from client!");

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    features: [],
    technologies: [],
    liveDemoLink: "",
    repoLink: "",
    status: "Ongoing",
    image: null,
  });

  //   const [allProjects, setAllProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://chef-chiller-node.onrender.com/getallproject"
        );
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
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

  useEffect(() => {
    socket.on("projectDeleted", (deletedProject) => {
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== deletedProject.id)
      );
    });

    return () => {
      socket.off("projectDeleted");
    };
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("projects", JSON.stringify(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...projectData, [name]: value };
    setProjectData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    if (e.key === "Enter" && value.trim()) {
      const updatedData = {
        ...projectData,
        [fieldName]: [...projectData[fieldName], value.trim()],
      };
      setProjectData(updatedData);
      saveToLocalStorage(updatedData);
      e.target.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedData = { ...projectData, image: file };
      setProjectData(updatedData);
      saveToLocalStorage(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectData.title || !projectData.description || !projectData.image) {
      setError("Title, Description, and Image are required!");
      return;
    }

    setError("");

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("features", JSON.stringify(projectData.features));
    formData.append("technologies", JSON.stringify(projectData.technologies));
    formData.append("liveDemoLink", projectData.liveDemoLink);
    formData.append("repoLink", projectData.repoLink);
    formData.append("status", projectData.status);
    if (projectData.image) {
      formData.append("image", projectData.image);
    }

    try {
      const response = await axios.post(
        "https://chef-chiller-node.onrender.com/uploadmyproject",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Project submitted successfully!");

      socket.emit("newProject", response.data);
      setProjectData({
        title: "",
        description: "",
        features: [],
        technologies: [],
        liveDemoLink: "",
        repoLink: "",
        status: "Ongoing",
        image: null,
      });
      saveToLocalStorage([]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload the project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  };

  const handleDeleteProject = (index) => {
    const projectToDelete = projects[index];
    const id = projectToDelete._id;

    fetch(`https://chef-chiller-node.onrender.com/deleteproject/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Project deleted successfully!") {
          const updatedProjects = [...projects];
          updatedProjects.splice(index, 1);
          setProjects(updatedProjects);
          saveToLocalStorage(updatedProjects);
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleEditProject = (index) => {
    const projectToEdit = projects[index];
    setProjectData(projectToEdit);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          Project Management
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={projectData.title}
            onChange={handleInputChange}
            className="w-full p-3 border rounded focus:outline-purple-500"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={projectData.description}
            onChange={handleInputChange}
            className="w-full p-3 border rounded focus:outline-purple-500"
          ></textarea>
          <input
            type="text"
            placeholder="Add a feature (Press Enter)"
            onKeyDown={(e) => handleArrayChange(e, "features")}
            className="w-full p-3 border rounded focus:outline-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            {projectData.features.map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-purple-100 text-purple-600 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a technology (Press Enter)"
            onKeyDown={(e) => handleArrayChange(e, "technologies")}
            className="w-full p-3 border rounded focus:outline-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            {projectData.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-block bg-purple-100 text-purple-600 px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="liveDemoLink"
            placeholder="Live Demo Link"
            value={projectData.liveDemoLink}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="repoLink"
            placeholder="Repository Link"
            value={projectData.repoLink}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          />
          <select
            name="status"
            value={projectData.status}
            onChange={handleInputChange}
            className="w-full p-3 border rounded focus:outline-purple-500"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </button>
        </form>

        {/* Project List */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            All Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check if projects is an array and has items */}
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded shadow-sm space-y-2"
                >
                  <h4 className="font-bold text-purple-600">{project.title}</h4>
                  <p className="text-gray-600">{project.description}</p>
                  {project.image && (
                    <img
                      src={project.image}
                      alt="Project"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditProject(index)}
                      className="text-red-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(index)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No projects available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
