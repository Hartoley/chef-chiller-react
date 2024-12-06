import React, { useState } from "react";
import "./user.css";

const Messages = () => {
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSave = () => {
    if (!location || !phoneNumber) {
      alert("Please fill out all fields.");
      return;
    }

    // Simulate saving the data
    console.log("Location:", location);
    console.log("Phone Number:", phoneNumber);
    alert("Settings updated successfully!");
  };

  return (
    <main className="child flex-1 p-6 bg-gray-200 w-[63.65vw]">
      <section className="section1 flex items-center justify-between mb-6">
        <div className="settings w-full h-full rounded-lg p-4 flex flex-col bg-white shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">
            Update Settings
          </h2>
          <div className="form-container flex flex-col gap-6">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Select Location
              </label>
              <select
                id="location"
                value={location}
                onChange={handleLocationChange}
                className="w-full p-2 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4185b5]"
              >
                <option value="" disabled>
                  -- Select a Location --
                </option>
                <option value="Bodija">Bodija</option>
                <option value="Dugbe">Dugbe</option>
                <option value="UI">University of Ibadan</option>
                <option value="Mokola">Mokola</option>
                <option value="Ring Road">Ring Road</option>
                <option value="Challenge">Challenge</option>
                <option value="Iwo Road">Iwo Road</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter your phone number"
                className="w-full p-2 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4185b5]"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Messages;
