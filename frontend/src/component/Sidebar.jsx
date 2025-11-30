import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiActivity, FiMessageSquare, FiDollarSign, FiPackage, FiClock, FiLayers } from 'react-icons/fi';

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo">
      <div className="logo-icon">+</div>
      <h2>WellNest</h2>
    </div>
    <ul className="nav-links">
      <li>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiGrid /> Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiCalendar /> Appointments
        </NavLink>
      </li>
      <li>
        <NavLink to="/patients" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUsers /> Patients
        </NavLink>
      </li>
      <li>
        <NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiActivity /> Doctors
        </NavLink>
      </li>
      <li>
        <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiLayers /> Departments
        </NavLink>
      </li>
      <li>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiClock /> Doctors' Schedule
        </NavLink>
      </li>
      <li>
        <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiDollarSign /> Payments
        </NavLink>
      </li>
      <li>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiPackage /> Inventory
        </NavLink>
      </li>
      <li>
        <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiMessageSquare /> Messages <span className="badge">7</span>
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Sidebar;