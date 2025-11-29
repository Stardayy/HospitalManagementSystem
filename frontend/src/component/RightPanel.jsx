import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const RightPanel = () => {
  const [value, onChange] = useState(new Date(2028, 6, 12));

  return (
    <div className="right-panel">
      <div className="calendar-box">
        <Calendar onChange={onChange} value={value} />
      </div>
      
      <div className="schedule-box">
        <h3>Wednesday, 12 July</h3>
        <button className="add-btn">+</button>
        
        <div className="timeline">
          <div className="event-card teal">
            <h4>Morning Staff Meeting</h4>
            <p>08:00 AM - 09:00 AM</p>
          </div>
          <div className="event-card light">
            <h4>Patient Consultation</h4>
            <p>10:00 AM - 12:00 PM</p>
          </div>
          <div className="event-card green">
            <h4>Surgery - Orthopedics</h4>
            <p>01:00 PM - 03:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;