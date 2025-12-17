import React from 'react';

const DoctorRow = ({ name, role, status }) => {
  const displayName = name || 'Unknown';
  const displayRole = role || '';
  const displayStatus = status || 'N/A';
  
  return (
    <div className="doctor-row">
      <div className="doctor-info">
        <div className="avatar">{displayName.charAt(0)}</div>
        <div>
          <h4>{displayName}</h4>
          <p>{displayRole}</p>
        </div>
      </div>
      <span className={`status ${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>{displayStatus}</span>
    </div>
  );
};

export default DoctorRow;