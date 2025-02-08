import React, { useState } from "react";
import CalendarList from "./calendar-list";
import { format } from "date-fns";
import EditEvents from "../event-sections/edit-event";

const PaginatedList = ({ events, deleteEvent }) => {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const eventsPerPage = 10; // Number of events per page

  // Calculate the start and end indices for slicing the events array
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const totalIndex = events.length;

  // Slice the events array to get only the events for the current page
  const currentEvents = events.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Handler to change the page
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //Edit button section
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Handle tile click to open the popup
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  return (
    <div>
      {/* Render paginated events */}

      <div className="relative overflow-x-auto p-4">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-none text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <h1 className="my-6 text-center text-2xl font-bold underline">
              List Of Events
            </h1>
          </thead>
          <tbody className="h-46vh min-h-screen">
            <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
              {currentEvents.map((event, index) => (
                <tr
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  key={index}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {event.title}
                  </th>
                  <td className="px-6 py-4">{event.description}</td>
                  <td className="px-6 py-4">{event.location}</td>
                  <td className="px-6 py-4">
                    {format(new Date(event.startTime), "MMMM d, yyyy, h:mm a")}
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(event.endTime), "MMMM d, yyyy, h:mm a")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      //class="font-small rounded-lg bg-red-700 px-2.5 py-1.5 text-center text-sm text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      className="font-small text-red-500"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <EditEvents editEvents={event} />
                  </td>
                </tr>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <nav
        className="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row"
        aria-label="Table navigation"
      >
        <span className="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {startIndex + 1} to {endIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalIndex}
          </span>
        </span>
        <ul className="h-8 inline-flex -space-x-px text-sm rtl:space-x-reverse">
          <li>
            <button
              className="h-8 ms-0 flex items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className="h-8 flex items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePageChange(index + 1)}
                style={{
                  fontWeight: currentPage === index + 1 ? "bold" : "normal",
                }}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className="h-8 flex items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default PaginatedList;
