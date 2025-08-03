import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUserShield,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const baseURL = "http://localhost:5003";
const dummyAvatar =
  "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/qurioans/getuser/${userId}`);
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching user");
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 text-xl font-medium">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-indigo-200">
        <div className="bg-indigo-600 py-10 px-8 text-white relative">
          <div className="absolute top-6 right-6 text-sm bg-white text-indigo-800 px-4 py-1 rounded-full font-semibold shadow">
            {user.role}
          </div>
          <div className="flex flex-col items-center">
            <img
              src={user.avatarUrl || dummyAvatar}
              alt="avatar"
              className="w-36 h-36 rounded-full shadow-lg border-4 border-white mb-4"
            />
            <h1 className="text-3xl font-bold tracking-wide">
              {user.userName}
            </h1>
            <p className="text-indigo-100 mt-1">
              {user.firstName || "First"} {user.lastName || "Last"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {user.isVerified && (
                <span className="flex items-center gap-1 text-sm text-green-200">
                  <FaCheckCircle /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 text-gray-700">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-500" />
              <span>{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-indigo-500" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">
              Preferences
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-indigo-50 p-3 rounded-xl shadow">
                <span className="font-medium">Dark Mode:</span>{" "}
                {user.darkMode ? "Enabled" : "Disabled"}
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl shadow">
                <span className="font-medium">Email Notifications:</span>{" "}
                {user.notificationPreferences?.email ? "On" : "Off"}
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl shadow">
                <span className="font-medium">Push Notifications:</span>{" "}
                {user.notificationPreferences?.push ? "On" : "Off"}
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl shadow">
                <span className="font-medium">2FA:</span>{" "}
                {user.twoFactorEnabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
