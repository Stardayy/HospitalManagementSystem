import React, { useState, useEffect } from 'react';
import { FiSearch, FiSettings, FiBell, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import CustomSelect from '../component/CustomSelect';
import '../styles/Pages.css';

const DoctorsSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [viewMode, setViewMode] = useState('week');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDoctorAndDate = (doctorId, date) => {
    return appointments.filter(apt => 
      apt.doctor?.id === doctorId && 
      apt.appointmentDate === formatDate(date)
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return '#10b981';
      case 'CONFIRMED': return '#3b82f6';
      case 'SCHEDULED': return '#6ee7b7';
      case 'CANCELLED': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays();
  const filteredDoctors = selectedDoctor === 'ALL' 
    ? doctors 
    : doctors.filter(d => d.id.toString() === selectedDoctor);

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search schedule..." />
          </div>
          <div className="user-tools">
            <FiSettings />
            <FiBell />
            <div className="user-profile">
              <img src="https://via.placeholder.com/30" alt="User" />
              <span>Alfredo Westervelt</span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <h1>Doctors' Schedule</h1>
          <div className="schedule-controls">
            <CustomSelect
              options={[
                { value: 'ALL', label: 'All Doctors' },
                ...doctors.map(d => ({ value: d.id.toString(), label: `Dr. ${d.firstName} ${d.lastName}` }))
              ]}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              placeholder="Select Doctor"
            />
          </div>
        </div>

        <div className="schedule-navigation">
          <button className="btn-icon" onClick={() => navigateWeek(-1)}>
            <FiChevronLeft />
          </button>
          <h2>
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
            {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button className="btn-icon" onClick={() => navigateWeek(1)}>
            <FiChevronRight />
          </button>
          <button className="btn-today" onClick={() => setCurrentDate(new Date())}>
            Today
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="schedule-container">
            <div className="schedule-grid">
              <div className="schedule-header">
                <div className="time-column-header">
                  <FiClock />
                </div>
                {weekDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`day-header ${formatDate(day) === formatDate(new Date()) ? 'today' : ''}`}
                  >
                    <span className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="day-number">{day.getDate()}</span>
                  </div>
                ))}
              </div>
              
              <div className="schedule-body">
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="doctor-schedule-row">
                    <div className="doctor-info-cell">
                      <div>
                        <span className="doctor-name">Dr. {doctor.firstName} {doctor.lastName}</span>
                        <span className="doctor-spec">{doctor.specialization}</span>
                      </div>
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const dayAppointments = getAppointmentsForDoctorAndDate(doctor.id, day);
                      return (
                        <div 
                          key={dayIndex} 
                          className={`schedule-cell ${formatDate(day) === formatDate(new Date()) ? 'today' : ''}`}
                        >
                          {dayAppointments.map(apt => (
                            <div 
                              key={apt.id} 
                              className="appointment-block"
                              style={{ borderLeftColor: getStatusColor(apt.status) }}
                            >
                              <span className="apt-time">{apt.appointmentTime?.substring(0, 5)}</span>
                              <span className="apt-patient">{apt.patient?.firstName} {apt.patient?.lastName}</span>
                              <span className="apt-reason">{apt.reason || 'Consultation'}</span>
                            </div>
                          ))}
                          {dayAppointments.length === 0 && (
                            <div className="empty-slot">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {filteredDoctors.length === 0 && (
              <div className="no-data">No doctors found</div>
            )}

            <div className="schedule-legend">
              <h4>Status Legend</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#6ee7b7' }}></span>
                  <span>Scheduled</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
                  <span>Confirmed</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorsSchedule;
