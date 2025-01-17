"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const EditEvents = ({ editEvents = [], setRefreshGrid }) => {
  const [events, setEvents] = useState([editEvents]);
  const [editEventId, setEditEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  //let editEvents = [];
  // Fetch events from API
  /*const fetchEvents = async () => {
    try {
      const response = await fetch("/api/getEvents");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);*/

  //Edit button section
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  // Handle input changes for the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle click on Edit button
  const handleEditClick = (event) => {
    setEditEventId(event.id); // Set the event to be edited
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
    });
    setIsEditModalOpen(true);
  };

  // Handle click on Save button
  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/editEvents/${editEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editEventId ? { ...event, ...updatedEvent } : event,
          ),
        );
        setEditEventId(null); // Exit edit mode
        setRefreshGrid((prev) => !prev);
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Handle click on Cancel button
  const handleCancelClick = () => {
    setEditEventId(null); // Exit edit mode without saving
    setIsEditModalOpen(false);
  };

  return (
    <div>
      {events.map((event) => (
        <ul key={event.id}>
          {isEditModalOpen && editEventId === event.id ? (
            <div className="modal-overlay" onClick={toggleEditModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <form>
                  <div className="pb-8">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={toggleEditModal}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <div className="modal-header pb-2">
                      <h2 className="text-base/7 font-semibold text-gray-900">
                        Edit Event{" "}
                      </h2>
                      <p className="mt-1 text-sm/6 text-gray-600">
                        Make changes to your form here.
                      </p>
                    </div>
                    <div className="modal-body pt-2">
                      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            for="title"
                            className="block pb-2 text-left text-sm/6 font-medium text-gray-900"
                          >
                            Event Title
                          </label>
                          <div>
                            <input
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleInputChange}
                              placeholder="Event Title"
                              className="block w-full rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            for="about"
                            className="block pb-2 text-left text-sm/6 font-medium text-gray-900"
                          >
                            Event Description
                          </label>
                          <div>
                            <textarea
                              name="description"
                              id="description"
                              rows="3"
                              className="block w-full rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              value={editFormData.description}
                              onChange={handleInputChange}
                              placeholder="Event description..."
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            for="location"
                            className="block pb-2 text-left text-sm/6 font-medium text-gray-900"
                          >
                            Event Location
                          </label>
                          <div>
                            <input
                              type="text"
                              name="location"
                              value={editFormData.location}
                              onChange={handleInputChange}
                              placeholder="Event location..."
                              className="block w-full rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            for="startTime"
                            className="block pb-2 text-left text-sm/6 font-medium text-gray-900"
                          >
                            Start Time
                          </label>
                          <div>
                            <input
                              type="date"
                              name="startTime"
                              value={editFormData.startTime}
                              onChange={handleInputChange}
                              className="block w-full rounded-md bg-white text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            for="startTime"
                            className="block pb-2 text-left text-sm/6 font-medium text-gray-900"
                          >
                            End Time
                          </label>
                          <div>
                            <input
                              type="date"
                              name="endTime"
                              value={editFormData.endTime}
                              onChange={handleInputChange}
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div className="col-span-full mt-3 flex items-center gap-x-6">
                          <button
                            type="button"
                            className="text-sm/6 font-semibold text-gray-900"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={handleSaveClick}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <button
                className="font-small edit-button text-blue-500"
                onClick={() => handleEditClick(event)}
              >
                Edit
              </button>
            </div>
          )}
        </ul>
      ))}
    </div>
  );
};
export default EditEvents;
