import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiActivity, FiMessageSquare, FiDollarSign, FiPackage, FiClock, FiLayers, FiLogOut, FiFileText, FiHome, FiHeart, FiBell, FiFile, FiUserPlus, FiDroplet, FiClipboard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Sidebar = () => {
  const { user, logout, isAdmin, isDoctor, isPatient, isPharmacist, isNurse } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.get('/messages/unread/count');
        setUnreadCount(data.count || data || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    const fetchNotificationCount = async () => {
      try {
        const data = await api.get('/notifications/unread/count');
        setNotificationCount(data.count || data || 0);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      fetchNotificationCount();
      // Poll for unread messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchNotificationCount();
      }, 30000);
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
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/patients" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Patients
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/medical-records" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiFileText /> Medical Records
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient() || isNurse()) && (
          <li>
            <NavLink to="/vitals" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHeart /> {isPatient() ? 'My Vitals' : 'Vital Signs'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/lab" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDroplet /> Lab Management
            </NavLink>
          </li>
        )}
        {(isAdmin() || isNurse()) && (
          <li>
            <NavLink to="/admissions" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUserPlus /> Admissions
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiFile /> {isPatient() ? 'My Documents' : 'Documents'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient() || isPharmacist()) && (
          <li>
            <NavLink to="/prescriptions" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiClipboard /> {isPatient() ? 'My Prescriptions' : 'Prescriptions'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isPatient()) && (
          <li>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiActivity /> {isPatient() ? 'My Doctors' : 'Doctors'}
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
        {isAdmin() && (
          <li>
            <NavLink to="/staff" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Staff Management
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/insurance" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDollarSign /> Insurance Claims
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/emergency" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHeart /> Emergency
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiClock /> {isPatient() ? 'My Schedule' : "Doctors' Schedule"}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isPatient()) && (
          <li>
            <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDollarSign /> {isPatient() ? 'My Payments' : 'Payments'}
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
        {isAdmin() && (
          <li>
            <NavLink to="/audit-logs" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiShield /> Audit Logs
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBell /> Notifications {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </NavLink>
        </li>
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