import React, { useState, useEffect } from "react";

const BlogEditor = () => {
  const blogId = "683cb0a2a005eb68fa49cd32";
  const adminId = "683eaf633f503cfef052006d";

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    body: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [existingMedia, setExistingMedia] = useState([]); // All existing images/videos
  const [mediaToKeep, setMediaToKeep] = useState([]); // Only URLs to keep
  const [newMedia, setNewMedia] = useState([]); // Newly uploaded files

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `https://qurioans.onrender.com/getblog/${blogId}`
        );
        if (!res.ok) throw new Error("Failed to fetch blog data");

        const data = await res.json();
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          body: data.body || "",
        });

        setExistingMedia(data.image || []);
        setMediaToKeep((data.image || []).map((item) => item.image));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    setNewMedia((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleRemoveExistingMedia = (url) => {
    setMediaToKeep((prev) => prev.filter((m) => m !== url));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("body", formData.body);
    data.append("imagesToKeep", JSON.stringify(mediaToKeep));

    newMedia.forEach((file) => {
      data.append("files", file);
    });

    try {
      const res = await fetch(
        `https://qurioans.onrender.com/updateblog/${adminId}/${blogId}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Failed to update blog");

      const result = await res.json();
      alert("Blog updated successfully!");
      window.location.reload();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Blog Post</h2>
      <form onSubmit={handleUpdate} style={styles.form}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleTextChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Subtitle</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleTextChange}
          style={styles.input}
        />

        <label style={styles.label}>Body</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleTextChange}
          style={styles.textarea}
          required
        />

        <label style={styles.label}>Existing Media</label>
        <div style={styles.mediaGrid}>
          {existingMedia.map((item, index) =>
            mediaToKeep.includes(item.image) ? (
              <div key={index} style={styles.mediaWrapper}>
                {item.image.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={item.image} controls style={styles.video} />
                ) : (
                  <img src={item.image} alt="media" style={styles.image} />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveExistingMedia(item.image)}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ) : null
          )}
        </div>

        <label style={styles.label}>Upload New Images or Videos</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />

        {newMedia.length > 0 && (
          <div style={styles.mediaGrid}>
            {newMedia.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} style={styles.mediaWrapper}>
                  {file.type.startsWith("video/") ? (
                    <video src={url} controls style={styles.video} />
                  ) : (
                    <img src={url} alt="new" style={styles.image} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" style={styles.submitButton}>
          Update Blog
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    padding: "10px",
    height: "150px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  mediaGrid: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  mediaWrapper: {
    position: "relative",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  video: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    textAlign: "center",
    lineHeight: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default BlogEditor;
