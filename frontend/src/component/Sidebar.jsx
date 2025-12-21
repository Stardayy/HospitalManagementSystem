import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiActivity, FiMessageSquare, FiDollarSign, FiPackage, FiClock, FiLayers, FiLogOut, FiFileText, FiHome, FiHeart, FiBell, FiFile, FiUserPlus, FiDroplet, FiClipboard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import '../styles/NavigationFix.css';

const Sidebar = () => {
  const { user, logout, isAdmin, isDoctor, isPatient, isPharmacist, isNurse } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Refs to track scroll positions
  const sidebarRef = useRef(null);
  const navLinksRef = useRef(null);
  const savedScrollPosition = useRef(0);

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

  // Restore scroll position after route change
  useEffect(() => {
    if (navLinksRef.current && savedScrollPosition.current > 0) {
      navLinksRef.current.scrollTop = savedScrollPosition.current;
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Save scroll position before navigation
  const handleNavClick = (e) => {
    if (navLinksRef.current) {
      savedScrollPosition.current = navLinksRef.current.scrollTop;
    }
    // Blur to prevent focus scroll
    e.currentTarget.blur();
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="logo">
        <div className="logo-icon">+</div>
        <h2>WellNest</h2>
      </div>

      <ul className="nav-links" ref={navLinksRef}>
        <li>

          <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
            <FiGrid /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointments" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
            <FiCalendar /> Appointments
          </NavLink>
        </li>
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/patients" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Patients
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/medical-records" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiFileText /> Medical Records
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient() || isNurse()) && (
          <li>
            <NavLink to="/vitals" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHeart /> {isPatient() ? 'My Vitals' : 'Vital Signs'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/lab" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDroplet /> Lab Management
            </NavLink>
          </li>
        )}
        {(isAdmin() || isNurse()) && (
          <li>
            <NavLink to="/admissions" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUserPlus /> Admissions
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/documents" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiFile /> {isPatient() ? 'My Documents' : 'Documents'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient() || isPharmacist()) && (
          <li>
            <NavLink to="/prescriptions" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiClipboard /> {isPatient() ? 'My Prescriptions' : 'Prescriptions'}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isPatient()) && (
          <li>
            <NavLink to="/doctors" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiActivity /> {isPatient() ? 'My Doctors' : 'Doctors'}
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/departments" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiLayers /> Departments
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/rooms" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHome /> Rooms
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/staff" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Staff Management
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/insurance" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDollarSign /> Insurance Claims
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isNurse()) && (
          <li>
            <NavLink to="/emergency" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHeart /> Emergency
            </NavLink>
          </li>
        )}
        {(isAdmin() || isDoctor() || isPatient()) && (
          <li>
            <NavLink to="/schedule" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiClock /> {isPatient() ? 'My Schedule' : "Doctors' Schedule"}
            </NavLink>
          </li>
        )}
        {(isAdmin() || isPatient()) && (
          <li>
            <NavLink to="/payments" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiDollarSign /> {isPatient() ? 'My Payments' : 'Payments'}
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/inventory" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiPackage /> Inventory
            </NavLink>
          </li>
        )}
        {isAdmin() && (
          <li>
            <NavLink to="/audit-logs" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
              <FiShield /> Audit Logs
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/notifications" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBell /> Notifications {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" onClick={handleNavClick} className={({ isActive }) => isActive ? 'active' : ''}>
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