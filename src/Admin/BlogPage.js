import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCommentDots, FaTimes } from "react-icons/fa";

const dummyUserId = "683eaedb3f503cfef0520069";
const baseURL = "http://localhost:5003";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showLikers, setShowLikers] = useState(null); // { blogId, likers }

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseURL}/blogs`);
      setBlogs(res.data);
      console.log(res.data);
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

              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => handleLike(blog._id)}
                  className="flex items-center gap-2 text-red-600 text-lg font-medium"
                >
                  {blog.likes.includes(dummyUserId) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}{" "}
                  {blog.likesCount}
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCommentDots /> <span>{blog.commentsCount}</span>
                </div>
              </div>

              {blog.likes && blog.likes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-700 items-center">
                  {blog.likes.slice(0, 2).map((liker) => (
                    <a
                      key={liker._id}
                      href={`/profile/${liker._id}`}
                      className="flex items-center space-x-2 hover:underline"
                    >
                      <img
                        src={
                          liker.avatarUrl ||
                          "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                        }
                        alt="liker avatar"
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{liker.userName}</span>
                    </a>
                  ))}
                  {blog.likes.length > 2 && (
                    <button
                      onClick={() =>
                        setShowLikers({
                          blogId: blog._id,
                          likers: blog.likes,
                        })
                      }
                      className="text-indigo-600 hover:underline"
                    >
                      +{blog.likes.length - 2} more
                    </button>
                  )}
                </div>
              )}

              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[blog._id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [blog._id]: e.target.value,
                  })
                }
                className="w-full border px-4 py-3 rounded-full mb-4"
              />
              <button
                onClick={() => handleComment(blog._id)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full"
              >
                Comment
              </button>

              <div className="mt-4 space-y-4">
                {blog.comments.map((c) => {
                  const commenter = c.commenter?.userId;

                  return (
                    <div key={c._id} className="bg-indigo-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={
                            commenter?.avatarUrl ||
                            "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                          }
                          alt="commenter avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <a
                          href={`/profile/${commenter?._id}`}
                          className="font-semibold text-indigo-800"
                        >
                          {commenter?.userName || "Unknown User"}
                        </a>
                      </div>
                      <p className="text-sm text-gray-800 mb-1">{c.comment}</p>
                      <div className="text-xs text-gray-500 flex justify-between mb-2">
                        <span>Likes: {c.likesCount}</span>
                        <button
                          onClick={() => handleLikeComment(c._id, blog._id)}
                          className="text-red-500"
                          aria-label="Like comment"
                        >
                          <FaHeart />
                        </button>
                      </div>
                      <div className="ml-4">
                        {c.replies?.map((r, index) => {
                          const replier = r.commenter?.id;

                          return (
                            <div
                              key={r._id || index}
                              className="bg-white p-2 mt-2 rounded-xl border"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={
                                    replier?.avatarUrl ||
                                    "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                                  }
                                  alt="replier avatar"
                                  className="w-6 h-6 rounded-full"
                                />
                                <a
                                  href={`/profile/${replier?._id}`}
                                  className="text-xs font-semibold text-indigo-700"
                                >
                                  {replier?.userName || "Unknown User"}
                                </a>
                              </div>
                              <p className="text-xs text-gray-700">
                                {r.comment}
                              </p>
                              <div className="text-xs text-gray-400 flex justify-between">
                                <span>Likes: {r.likesCount}</span>
                                <button
                                  onClick={() =>
                                    handleLikeReply(blog._id, c._id, index)
                                  }
                                  className="text-red-400"
                                  aria-label="Like reply"
                                >
                                  <FaHeart size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <input
                          type="text"
                          placeholder="Add a reply..."
                          value={replyInputs[c._id] || ""}
                          onChange={(e) =>
                            setReplyInputs({
                              ...replyInputs,
                              [c._id]: e.target.value,
                            })
                          }
                          className="mt-2 w-full border px-3 py-2 rounded-full"
                        />
                        <button
                          onClick={() => handleReply(blog._id, c._id)}
                          className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-1 text-xs"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Likers Modal */}
      {showLikers && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-600"
              onClick={() => setShowLikers(null)}
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold mb-4">Liked by</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {showLikers.likers.map((liker) => (
                <a
                  key={liker._id}
                  href={`/profile/${liker._id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md"
                >
                  <img
                    src={
                      liker.avatarUrl ||
                      "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{liker.userName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
