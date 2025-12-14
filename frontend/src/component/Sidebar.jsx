import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiActivity, FiMessageSquare, FiDollarSign, FiPackage, FiClock, FiLayers, FiLogOut, FiFileText, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Sidebar = () => {
  const { user, logout, isAdmin, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.get('/messages/unread/count');
        setUnreadCount(data.count || data || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Poll for unread messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
        {(isAdmin() || isDoctor()) && (
          <li>
            <NavLink to="/patients" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Patients
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor()) && (
          <li>
            <NavLink to="/medical-records" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiFileText /> Medical Records
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiActivity /> Doctors
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiLayers /> Departments
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHome /> Rooms
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor()) && (
          <li>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiClock /> Doctors' Schedule
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDollarSign /> Payments
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiPackage /> Inventory
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiMessageSquare /> Messages {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;