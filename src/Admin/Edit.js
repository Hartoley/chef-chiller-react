import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";

const dummyUserId = "683eaedb3f503cfef0520069";
const baseURL = "http://localhost:5003";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showLikersFor, setShowLikersFor] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseURL}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      alert(
        "Error fetching blogs: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleLike = async (blogId) => {
    try {
      const res = await axios.put(
        `${baseURL}/likeblog/${dummyUserId}/${blogId}`
      );
      alert(res.data.message || "Blog liked successfully");
      fetchBlogs();
    } catch (err) {
      alert("Error liking blog: " + (err.response?.data?.error || err.message));
    }
  };

  const handleComment = async (blogId) => {
    try {
      const comment = commentInputs[blogId];
      if (!comment) return;
      await axios.put(`${baseURL}/comment/${dummyUserId}/${blogId}`, {
        comment,
        model: "User",
      });
      alert("Comment added successfully");
      setCommentInputs({ ...commentInputs, [blogId]: "" });
      fetchBlogs();
    } catch (err) {
      alert(
        "Error adding comment: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleLikeComment = async (commentId, blogId) => {
    try {
      await axios.put(`${baseURL}/likecomment/${blogId}/${commentId}`, {
        userId: dummyUserId,
      });
      alert("Comment liked successfully");
      fetchBlogs();
    } catch (err) {
      alert(
        "Error liking comment: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleLikeReply = async (blogId, commentId, replyIndex) => {
    try {
      await axios.put(
        `${baseURL}/likereply/${blogId}/${commentId}/${replyIndex}`,
        {
          userId: dummyUserId,
        }
      );
      alert("Reply liked successfully");
      fetchBlogs();
    } catch (err) {
      alert(
        "Error liking reply: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleReply = async (blogId, commentId) => {
    try {
      const reply = replyInputs[commentId];
      if (!reply) return;
      await axios.put(`${baseURL}/replycomment/${blogId}/${commentId}`, {
        comment: reply,
        commenter: { id: dummyUserId, model: "User" },
      });
      alert("Reply added successfully");
      setReplyInputs({ ...replyInputs, [commentId]: "" });
      fetchBlogs();
    } catch (err) {
      alert(
        "Error adding reply: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-12">
          Qurio&Ans Blog
        </h1>
        <div className="grid gap-16">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-indigo-200"
            >
              <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                {blog.title}
              </h2>
              {blog.subtitle && (
                <p className="text-xl italic text-indigo-700 mb-4">
                  {blog.subtitle}
                </p>
              )}
              <p className="text-gray-700 whitespace-pre-line mb-6 leading-relaxed">
                {blog.body}
              </p>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleLike(blog._id)}
                    className="flex items-center gap-2 text-red-600 text-lg font-medium"
                  >
                    {blog.likes.some((user) => user._id === dummyUserId) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}{" "}
                    {blog.likes.length}
                  </button>

                  <div className="flex -space-x-2">
                    {blog.likes.slice(0, 2).map((user) => (
                      <img
                        key={user._id}
                        src={
                          user.avatarUrl ||
                          "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                        }
                        alt={user.userName}
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>

                  {blog.likes.length > 2 && (
                    <button
                      onClick={() =>
                        setShowLikersFor(
                          showLikersFor === blog._id ? null : blog._id
                        )
                      }
                      className="text-sm text-indigo-700 underline"
                    >
                      +{blog.likes.length - 2} more
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-2 md:mt-0">
                  <FaCommentDots /> <span>{blog.commentsCount}</span>
                </div>
              </div>

              {showLikersFor === blog._id && (
                <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                  <h4 className="font-bold text-indigo-800 mb-2">Liked by:</h4>
                  <div className="flex flex-wrap gap-3">
                    {blog.likes.map((user) => (
                      <a
                        key={user._id}
                        href={`/profile/${user._id}`}
                        className="flex items-center gap-2 text-sm text-indigo-700 hover:underline"
                      >
                        <img
                          src={
                            user.avatarUrl ||
                            "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                          }
                          alt={user.userName}
                          className="w-6 h-6 rounded-full"
                        />
                        {user.userName}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments and replies section would continue here as in original code */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
