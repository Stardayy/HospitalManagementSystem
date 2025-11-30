import React, { useState, useEffect } from 'react';
import { FiSearch, FiSettings, FiBell, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiClock, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import CustomSelect from '../component/CustomSelect';
import '../styles/Pages.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
    status: 'SCHEDULED'
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

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

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await api.get('/patients');
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment.id}`, {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          reason: formData.reason,
          notes: formData.notes,
          status: formData.status
        });
      } else {
        await api.post(`/appointments?patientId=${formData.patientId}&doctorId=${formData.doctorId}`, {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          reason: formData.reason,
          notes: formData.notes,
          status: formData.status
        });
      }
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status?status=${status}`, {});
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        patientId: appointment.patient?.id || '',
        doctorId: appointment.doctor?.id || '',
        appointmentDate: appointment.appointmentDate || '',
        appointmentTime: appointment.appointmentTime || '',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        status: appointment.status || 'SCHEDULED'
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
        status: 'SCHEDULED'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'COMPLETED': return 'status-completed';
      case 'CONFIRMED': return 'status-confirmed';
      case 'SCHEDULED': return 'status-scheduled';
      case 'CANCELLED': return 'status-cancelled';
      case 'NO_SHOW': return 'status-no-show';
      default: return '';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <h1>Appointments</h1>
          <button className="btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Appointment
          </button>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-icon">
              <FiCalendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{appointments.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
              <FiClock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{appointments.filter(a => a.status === 'SCHEDULED').length}</span>
              <span className="stat-label">Scheduled</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
              <FiCheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{appointments.filter(a => a.status === 'CONFIRMED').length}</span>
              <span className="stat-label">Confirmed</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#059669' }}>
              <FiCheck size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{appointments.filter(a => a.status === 'COMPLETED').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626' }}>
              <FiXCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{appointments.filter(a => a.status === 'CANCELLED').length}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'NO_SHOW', label: 'No Show' }
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.id}</td>
                    <td>{apt.patient?.firstName} {apt.patient?.lastName}</td>
                    <td>Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>{apt.reason || '-'}</td>
                    <td>{apt.notes || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>{apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-success" onClick={() => handleStatusChange(apt.id, 'COMPLETED')} title="Mark Complete">
                          <FiCheck />
                        </button>
                        <button className="btn-icon btn-edit" onClick={() => openModal(apt)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(apt.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <div className="no-data">No appointments found</div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient</label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      required
                      disabled={editingAppointment}
                    >
                      <option value="">Select Patient</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Doctor</label>
                    <select
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      required
                      disabled={editingAppointment}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} - {d.specialization}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No Show</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Reason</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Reason for appointment"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingAppointment ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;
