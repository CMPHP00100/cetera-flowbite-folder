"use client";
import React, { useState } from "react";
import CreateEvent from "./create-event";
import CalendarList from "./calendar-list";
import CalendarGrid from "./calendar-grid";

const CalendarApp = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div class="calendar-container">
      <div className="flex flex-col justify-between gap-4 bg-gray-100 p-6 lg:grid lg:grid-cols-2">
        <CreateEvent setRefresh={setRefresh} />
        <CalendarGrid refresh={refresh} />
      </div>
      <div id="calendarList" className="grid grid-cols-1 grid-rows-2">
        <CalendarList refresh={refresh} />
      </div>
    </div>
  );
};
export default CalendarApp;
