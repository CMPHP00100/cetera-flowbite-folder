"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../custom-styles/calendar.css"; // Custom styles for full width
import React, { useState } from "react";
import { format } from "date-fns";

const CalendarGrid = ({ refresh, refreshGrid }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNewEvents = async () => {
    try {
      const response = await fetch("/api/getEvents"); // Call the API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();

      const formattedEvents = data.map((event) => ({
        ...event,
        date: new Date(event.startTime),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNewEvents();
  }, [refresh, refreshGrid]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Handle tile click to open the popup
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to render tile content
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsForDate = events.filter(
        (event) => event.date.toDateString() === date.toDateString(),
      );

      /*const eventForDate = events.find(
        (event) => event.date.toDateString() === date.toDateString(),
      );
      return eventForDate ? (
        <div className="event-title">{eventForDate.title}</div>
      ) : null;*/

      return eventsForDate.length > 0 ? (
        <div className="event-list">
          {eventsForDate.map((event, index) => (
            <div
              key={index}
              className="event-title event-dot"
              data-modal-target="default-modal"
              data-modal-toggle="default-modal"
              type="button"
            >
              {event.title}
            </div>
          ))}
        </div>
      ) : null;
    }
  };

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(
    (event) =>
      selectedDate && event.date.toDateString() === selectedDate.toDateString(),
  );

  // Handle tile click
  const handleDateClick = (eventsForSelectedDate) => {
    setSelectedDate(eventsForSelectedDate);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Calendar
        tileContent={renderTileContent}
        //onClickDay={(value) => alert(`Clicked date: ${value.toDateString()}`)}
        onClickDay={handleDateClick}
      />

      {/* Popup Modal */}
      {isModalOpen &&
        eventsForSelectedDate.map((event, index) => (
          <div key={index} className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={toggleModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="modal-header pb-2">
                <h2>{event.title}</h2>
              </div>
              <hr />
              <div class="modal-body pt-2">
                <p class="pb-2">{event.description}</p>
                <ul>
                  <li class="pb-2 text-sm text-gray-600">{event.location}</li>
                  <li class="pb-2 text-sm text-gray-600">
                    {format(new Date(event.startTime), "MMM dd yyyy, h:mm a")}{" "}
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="inline size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </span>{" "}
                    {format(new Date(event.endTime), "MMM dd yyyy, h:mm a")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default CalendarGrid;
