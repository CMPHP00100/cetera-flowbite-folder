//components/calendar-sections/calendar-list.js
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import PaginatedList from "./pagination";

// Environment-based API configuration
const getApiUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // For local development, use the local Cloudflare Worker
    return process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:8787';
  } else {
    // For production, use the deployed Cloudflare Worker
    return process.env.NEXT_PUBLIC_PROD_API_URL || 'https://sandbox_flowbite.raspy-math-fdba.workers.dev';
  }
};

const CalendarList = ({ refresh, setRefreshGrid }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/events`;
      
      console.log("Fetching events from:", endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Events fetched:", data);
      
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete event on server
  const deleteEvent = useCallback(async (id) => {
    try {
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/events/${id}`;
      
      console.log("Deleting event from:", endpoint);
      
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Update the frontend state
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== id)
          );
          setRefreshGrid((prev) => !prev);
          console.log("Event deleted successfully");
        } else {
          console.error("Failed to delete event:", result.error);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("HTTP error:", response.status, errorData);
        throw new Error(`Failed to delete event: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError(`Failed to delete event: ${error.message}`);
    }
  }, [setRefreshGrid]);

  React.useEffect(() => {
    fetchEvents();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error:</strong> {error}
        <button 
          onClick={fetchEvents}
          className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Environment Info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}<br/>
          <strong>API URL:</strong> {getApiUrl()}<br/>
          <strong>Events Count:</strong> {events.length}
        </div>
      )}
      
      <PaginatedList events={events} deleteEvent={deleteEvent} />
    </div>
  );
};

export default CalendarList;