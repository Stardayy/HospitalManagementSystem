import React from 'react';

const DoctorRow = ({ name, role, status }) => (
  <div className="doctor-row">
    <div className="doctor-info">
      <div className="avatar">{name.charAt(0)}</div>
      <div>
        <h4>{name}</h4>
        <p>{role}</p>
      </div>
    </div>
    <span className={`status ${status.toLowerCase()}`}>{status}</span>
  </div>
);

export default DoctorRow;