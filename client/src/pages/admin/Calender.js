import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from '@fullcalendar/core/locales/vi';

const Calendar = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Lịch hẹn sửa máy lạnh", date: "2025-05-28" },
    { id: "2", title: "Sửa máy giặt - KH Trần A", date: "2025-05-30" },
    { id: "3", title: "Thay dây điện - KH Lê B", date: "2025-06-01" }
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Nhập nội dung lịch hẹn mới:");
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        date: info.dateStr
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">Lịch đặt hẹn sửa chữa</h4>
      </div>
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          locale={viLocale}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;
