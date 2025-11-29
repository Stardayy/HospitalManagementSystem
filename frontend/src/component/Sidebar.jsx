import React from 'react';
import { FiGrid, FiCalendar, FiUsers, FiActivity, FiMessageSquare } from 'react-icons/fi';

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo">
      <div className="logo-icon">+</div>
      <h2>WellNest</h2>
    </div>
    <ul className="nav-links">
      <li className="active"><FiGrid /> Dashboard</li>
      <li><FiCalendar /> Appointments</li>
      <li><FiUsers /> Patients</li>
      <li><FiActivity /> Doctors</li>
      <li><FiGrid /> Departments</li>
      <li><FiCalendar /> Doctors' Schedule</li>
      <li><FiActivity /> Payments</li>
      <li><FiGrid /> Inventory</li>
      <li><FiMessageSquare /> Messages <span className="badge">7</span></li>
    </ul>
  </div>
);

export default Sidebar;