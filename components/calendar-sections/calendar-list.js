"use client";
import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import PaginatedList from "./pagination";
//import axios from "axios";

const CalendarList = ({ refresh, setRefreshGrid }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/getEvents"); // Call the API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      //console.log(data);
      setEvents(data); // Update state with fetched data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete event on server
  const deleteEvent = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/deleteEvents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        //console.log(result.message);

        // Update the frontend state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id),
        );
        setRefreshGrid((prev) => !prev);
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchEvents();
  }, [refresh, deleteEvent]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  //const data = Array.from({ length: 5 }, (_, index) => `Item ${index + 1}`); // Example data

  return (
    <div>
      <PaginatedList events={events} deleteEvent={deleteEvent} />
    </div>
  );
};

export default CalendarList;
