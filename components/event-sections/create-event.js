"use client";
import React, { useState } from "react";

export default function CreateEvent({ setRefresh }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        // Trigger refresh in the other component
        setRefresh((prev) => !prev);
      }
      console.log(formData.startTime, " ", formData.endTime);
      const data = await res.json();
      setResponse(data);
      console.error(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse({ success: false, error: error.message });
    }
  };

  return (
    <div className="h-full relative bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Create Event</h1>

      {/* Entering Events */}
      <div className="mb-4 mt-16">
        <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
          {/* Form Fields */}
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Event title..."
            value={formData.title}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
          />
          <input
            type="textarea"
            id="description"
            name="description"
            placeholder="Event description..."
            value={formData.description}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
          />
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Event location..."
            value={formData.location}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
          />
          <div className="mx-auto mb-2 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Start time:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5"></div>
                <input
                  type="datetime-local"
                  id="start-time"
                  name="startTime"
                  placeholder="Event date..."
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                End time:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5"></div>
                <input
                  type="datetime-local"
                  id="end-time"
                  name="endTime"
                  placeholder="Event date..."
                  value={formData.endTime}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Event
          </button>
        </form>
        {response && (
          <div
            style={{
              marginTop: "1rem",
              color: response.success ? "green" : "red",
            }}
          >
            {response.success ? "Event entered successfully!" : response.error}
          </div>
        )}
      </div>
    </div>
  );
}
