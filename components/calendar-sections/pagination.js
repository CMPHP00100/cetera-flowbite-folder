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
    <>
      {/* Render paginated events */}
      <div className="container p-4">
        <h1 className="display-5 mb-4 text-center">List Of Events</h1>

        {/* Events List */}
        <div className="row">
          {currentEvents.map((event, index) => (
            <div key={index} className="col-12 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="row">
                    {/* Main Event Info - Always visible */}
                    <div className="col-md-6">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text">{event.description}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt-fill me-2"></i>
                          {event.location}
                        </small>
                      </p>
                    </div>

                    {/* Date/Time Info - Visible on md and up */}
                    <div className="col-md-3 d-none d-md-block">
                      <p className="card-text">
                        <strong>Starts:</strong>
                        <br />
                        {format(
                          new Date(event.startTime),
                          "MMM d, yyyy h:mm a",
                        )}
                      </p>
                      <p className="card-text">
                        <strong>Ends:</strong>
                        <br />
                        {format(new Date(event.endTime), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>

                    {/* Actions - Stacked on mobile, inline on desktop */}
                    <div className="col-md-3 col-12 mt-md-0 mt-3">
                      <div className="d-flex flex-md-column flex-row gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm grow-1"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                        <EditEvents editEvents={event} className="grow-1" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile-only date/time info */}
                  <div className="d-md-none mt-3">
                    <div className="row">
                      <div className="col-6">
                        <p className="card-text small">
                          <strong>Starts:</strong>
                          <br />
                          {format(new Date(event.startTime), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="card-text small">
                          <strong>Ends:</strong>
                          <br />
                          {format(new Date(event.endTime), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav aria-label="Events pagination" className="mt-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-md-0 mb-3">
              <p className="text-muted mb-0">
                Showing{" "}
                <span className="fw-bold">
                  {startIndex + 1} to {endIndex}
                </span>{" "}
                of <span className="fw-bold">{totalIndex}</span>
              </p>
            </div>
            <div className="col-md-6">
              <ul className="pagination justify-content-center justify-content-md-end mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className="page-item">
                    <button
                      className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
export default PaginatedList;
