"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaTrash,
  FaEdit,
  FaSms,
  FaEnvelope,
  FaBell as FaInAppAlert,
} from "react-icons/fa";
import { AiOutlinePlus, AiOutlineDrag } from "react-icons/ai";
import "tailwindcss/tailwind.css";

const randomImage = "https://source.unsplash.com/random/300x200";

const CalendarApp = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Meeting with Team",
      date: "2023-10-10",
      notification: "email",
    },
    {
      id: 2,
      title: "Doctor Appointment",
      date: "2023-10-12",
      notification: "sms",
    },
  ]);

  const addEvent = () => {
    const newEvent = {
      id: Math.random(),
      title: "New Event",
      date: new Date().toISOString().split("T")[0],
      notification: "in-app",
    };
    setEvents([...events, newEvent]);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const editEvent = (id, updatedEvent) => {
    setEvents(events.map((event) => (event.id === id ? updatedEvent : event)));
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };
  return (
    <div className="app-container">
      <div className="flex min-h-screen flex-col justify-between bg-gray-100 p-6 md:grid md:grid-cols-2">
        <div className="w-full space-x-4 rounded bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              <FaCalendarAlt className="mr-2 inline" />
              Calendar
            </h2>
            <button
              onClick={addEvent}
              className="rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
            >
              <AiOutlinePlus />
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded bg-gray-50 p-4 shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded"
                    src={randomImage}
                    alt="event"
                  />
                  <div>
                    <div className="text-lg font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEdit
                    onClick={() =>
                      editEvent(event.id, {
                        ...event,
                        title: prompt("Edit event title", event.title),
                      })
                    }
                    className="cursor-pointer text-yellow-500"
                  />
                  <FaTrash
                    onClick={() => deleteEvent(event.id)}
                    className="cursor-pointer text-red-500"
                  />
                  {event.notification === "sms" && (
                    <FaSms className="text-green-500" />
                  )}
                  {event.notification === "email" && (
                    <FaEnvelope className="text-blue-500" />
                  )}
                  {event.notification === "in-app" && (
                    <FaInAppAlert className="text-purple-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-x-reverse-4 w-full rounded bg-white p-4 shadow">
          <Calendar
            className="w-full"
            onChange={addEvent}
            value={selectedDate}
          />
          <p>Selected Date: {selectedDate.toDateString()}</p>
        </div>
      </div>
    </div>
  );
};
export default CalendarApp;
