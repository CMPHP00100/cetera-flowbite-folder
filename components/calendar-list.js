"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import PaginatedList from "./pagination";

const CalendarList = ({ refresh }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/getevents"); // Call the API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data); // Update state with fetched data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, [refresh]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  //const data = Array.from({ length: 5 }, (_, index) => `Item ${index + 1}`); // Example data

  return <PaginatedList events={events} />;
};

export default CalendarList;
