"use client";

import React, { useState } from "react";
import CreateEvent from "../event-sections/create-event";
import CalendarList from "./calendar-list";
import CalendarGrid from "./calendar-grid";

const CalendarApp = () => {
  const [refresh, setRefresh] = useState(false);
  const [refreshGrid, setRefreshGrid] = useState(false);

  return (
    <div className="container-fluid">
      {/* <div class="calendar-container"> */}
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 bg-gray-100 p-6">
          <div class="row">
            <div class="col-12">
              <CreateEvent setRefresh={setRefresh} />
            </div>
            <div class="col-12">
              <CalendarGrid refresh={refresh} refreshGrid={refreshGrid} />
            </div>
          </div>
        </div>
        <div
          id="calendarList"
          className="col-12 col-sm-12 col-md-12 col-lg-6 mb-8"
        >
          <CalendarList refresh={refresh} setRefreshGrid={setRefreshGrid} />
        </div>
      </div>
    </div>
  );
};
export default CalendarApp;
