import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./user.css";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Customer 1",
      messages: [
        { sender: "customer", text: "Hello, I need help with my order." },
        { sender: "admin", text: "Sure, how can I assist you?" },
      ],
    },
    {
      id: 2,
      name: "Customer 2",
      messages: [
        { sender: "customer", text: "Can I change my reservation?" },
        {
          sender: "admin",
          text: "Of product, when would you like to reschedule?",
        },
      ],
    },
  ]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <main className="child flex-1 p-6 bg-gray-200 w-[63.65vw]">
      <section className="section1 flex items-center justify-between mb-6">
        <div className="chat w-full h-full rounded-lg p-4 flex flex-col">
          {selectedChat === null ? (
            // Chat List
            <>
              <h2 className="text-lg font-semibold text-center mb-4">
                Customer Support Chat
              </h2>
              <div className="chat-container flex flex-col gap-4 overflow-y-auto p-2 bg-white rounded-lg shadow-sm max-h-[400px]">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="chat-item bg-[#0f263d] p-3 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-[#4185b5] transition"
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className="chat-name text-sm text-white">
                      {chat.name}
                    </div>
                    <div className="chat-preview text-xs text-white">
                      {chat.messages[chat.messages.length - 1].text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Individual Chat Box
            <>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handleBackClick}
                  className="bg-[#4185b5] text-white px-4 py-2 rounded-md hover:bg-[#35658e]"
                >
                  Back
                </button>
                <h2 className="text-lg font-semibold text-center flex-grow">
                  Chat with {selectedChat.name}
                </h2>
              </div>
              <div className="chat-box bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message flex items-start gap-2 ${
                      msg.sender === "customer"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`avatar w-8 h-8 rounded-full ${
                        msg.sender === "customer"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      } flex items-center justify-center text-white`}
                    >
                      {msg.sender === "customer" ? "C" : "A"}
                    </div>
                    <div
                      className={`message-content p-3 rounded-md max-w-[70%] ${
                        msg.sender === "customer"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#4185b5] text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input mt-4 flex items-center gap-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4185b5]"
                  placeholder="Type your message..."
                />
                <button className="bg-[#4185b5] text-white p-2 rounded-lg hover:bg-[#35658e] focus:outline-none">
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Messages;
