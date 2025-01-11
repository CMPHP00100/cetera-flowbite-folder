"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./custom-styles/calendar.css"; // Custom styles for full width
import React, { useState } from "react";
import { format } from "date-fns";
import CalendarModal from "./calendar-modal";

const CalendarGrid = ({ refresh }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewEvents = async () => {
    try {
      const response = await fetch("/api/getevents"); // Call the API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();

      const formattedEvents = data.map((event) => ({
        ...event,
        date: new Date(event.startTime),
      }));
      console.log(formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNewEvents();
  }, [refresh]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Handle tile click to open the popup
  const handleTileClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
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
              onClick={() => handleTileClick(date)}
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

  return (
    <div>
      <Calendar
        tileContent={renderTileContent}
        //onClickDay={(value) => alert(`Clicked date: ${value.toDateString()}`)}
      />

      {/* Popup Modal */}
      {/*<Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Event Details"
        className="event-modal"
        overlayClassName="event-modal-overlay"
      >
        <h3>Events for {selectedDate?.toDateString()}</h3>
        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>*/}
      <CalendarModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        heading={selectedDate?.toDateString()}
        description="Description for the modal goes here..."
      />
    </div>
  );
};
export default CalendarGrid;
