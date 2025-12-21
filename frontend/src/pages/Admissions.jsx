import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiUserCheck, FiUserX, FiDownload, FiFilter, FiHome } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import Pagination from '../component/Pagination';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';

const Admissions = () => {
  const { isAdmin, isDoctor } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [dischargingAdmission, setDischargingAdmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    roomId: '',
    bedNumber: '',
    admissionDate: '',
    admissionTime: '',
    admissionType: 'MEDICAL',
    diagnosis: '',
    notes: ''
  });

  const [dischargeData, setDischargeData] = useState({
    dischargeSummary: '',
    dischargeDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAdmissions();
    fetchPatients();
    fetchDoctors();
    fetchRooms();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const data = await api.get('/admissions');
      setAdmissions(data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
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

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await api.get('/rooms');
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bedNumber: formData.bedNumber,
        admissionDate: formData.admissionDate,
        admissionTime: formData.admissionTime,
        admissionType: formData.admissionType,
        diagnosis: formData.diagnosis,
        notes: formData.notes
      };

      if (editingAdmission) {
        await api.put(`/admissions/${editingAdmission.id}`, payload);
      } else {
        await api.post(`/admissions?patientId=${formData.patientId}&doctorId=${formData.doctorId}&roomId=${formData.roomId}`, payload);
      }
      fetchAdmissions();
      closeModal();
    } catch (error) {
      console.error('Error saving admission:', error);
      alert(error.message);
    }
  };

  const handleDischarge = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admissions/${dischargingAdmission.id}/discharge`, {
        dischargeSummary: dischargeData.dischargeSummary
      });
      fetchAdmissions();
      closeDischargeModal();
    } catch (error) {
      console.error('Error discharging patient:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission record?')) {
      try {
        await api.delete(`/admissions/${id}`);
        fetchAdmissions();
      } catch (error) {
        console.error('Error deleting admission:', error);
      }
    }
  };

  const downloadAdmissionReport = async (admissionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/reports/admission/${admissionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission_summary_${admissionId}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const openModal = (admission = null) => {
    if (admission) {
      setEditingAdmission(admission);
      setFormData({
        patientId: admission.patient?.id || '',
        doctorId: admission.admittingDoctor?.id || '',
        roomId: admission.room?.id || '',
        bedNumber: admission.bedNumber || '',
        admissionDate: admission.admissionDate || '',
        admissionTime: admission.admissionTime || '',
        admissionType: admission.admissionType || 'MEDICAL',
        diagnosis: admission.diagnosis || '',
        notes: admission.notes || ''
      });
    } else {
      setEditingAdmission(null);
      const today = new Date();
      setFormData({
        patientId: '',
        doctorId: '',
        roomId: '',
        bedNumber: '',
        admissionDate: today.toISOString().split('T')[0],
        admissionTime: today.toTimeString().slice(0, 5),
        admissionType: 'MEDICAL',
        diagnosis: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmission(null);
  };

  const openDischargeModal = (admission) => {
    setDischargingAdmission(admission);
    setDischargeData({
      dischargeSummary: '',
      dischargeDate: new Date().toISOString().split('T')[0]
    });
    setShowDischargeModal(true);
  };

  const closeDischargeModal = () => {
    setShowDischargeModal(false);
    setDischargingAdmission(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ADMITTED': return 'status-confirmed';
      case 'DISCHARGED': return 'status-completed';
      case 'TRANSFERRED': return 'status-scheduled';
      case 'DECEASED': return 'status-cancelled';
      default: return '';
    }
  };

  const getAdmissionTypeClass = (type) => {
    switch (type) {
      case 'EMERGENCY': return 'type-emergency';
      case 'SURGICAL': return 'type-surgical';
      case 'MATERNITY': return 'type-maternity';
      default: return 'type-medical';
    }
  };

  const filteredAdmissions = admissions
    .filter(admission => {
      const matchesSearch =
        admission.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !activeFilters.status || admission.status === activeFilters.status;
      const matchesType = !activeFilters.type || admission.admissionType === activeFilters.type;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (!currentSort.sortBy) return 0;
      let comparison = 0;
      switch (currentSort.sortBy) {
        case 'date':
          comparison = new Date(a.admissionDate) - new Date(b.admissionDate);
          break;
        case 'patient':
          comparison = (a.patient?.lastName || '').localeCompare(b.patient?.lastName || '');
        case 'room':
          comparison = (a.room?.roomNumber || '').localeCompare(b.room?.roomNumber || '');
          break;
        default:
          return 0;
      }
      return currentSort.sortDirection === 'desc' ? -comparison : comparison;
    });

  // Pagination calculation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedAdmissions = filteredAdmissions.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, currentSort]);

  const filterConfig = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'ADMITTED', label: 'Admitted' },
        { value: 'DISCHARGED', label: 'Discharged' },
        { value: 'TRANSFERRED', label: 'Transferred' }
      ]
    },
    {
      name: 'type',
      label: 'Admission Type',
      type: 'select',
      options: [
        { value: 'EMERGENCY', label: 'Emergency' },
        { value: 'ELECTIVE', label: 'Elective' },
        { value: 'MATERNITY', label: 'Maternity' },
        { value: 'SURGICAL', label: 'Surgical' },
        { value: 'MEDICAL', label: 'Medical' }
      ]
    }
  ];

  const sortOptions = [
    { value: 'date', label: 'Admission Date' },
    { value: 'patient', label: 'Patient Name' },
    { value: 'room', label: 'Room Number' }
  ];

  // Calculate stats
  const currentlyAdmitted = admissions.filter(a => a.status === 'ADMITTED').length;
  const dischargedToday = admissions.filter(a =>
    a.status === 'DISCHARGED' &&
    a.actualDischargeDate === new Date().toISOString().split('T')[0]
  ).length;
  const emergencyAdmissions = admissions.filter(a =>
    a.admissionType === 'EMERGENCY' && a.status === 'ADMITTED'
  ).length;

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header pageTitle="Inpatient Admissions" />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header pageTitle="Inpatient Admissions" />

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon admitted"><FiUserCheck /></div>
            <div className="stat-info">
              <span className="stat-value">{currentlyAdmitted}</span>
              <span className="stat-label">Currently Admitted</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon discharged"><FiUserX /></div>
            <div className="stat-info">
              <span className="stat-value">{dischargedToday}</span>
              <span className="stat-label">Discharged Today</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon emergency"><FiHome /></div>
            <div className="stat-info">
              <span className="stat-value">{emergencyAdmissions}</span>
              <span className="stat-label">Emergency Cases</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total"><FiHome /></div>
            <div className="stat-info">
              <span className="stat-value">{rooms.filter(r => r.isAvailable).length}</span>
              <span className="stat-label">Available Rooms</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search admissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
              <FiFilter /> Filter
            </button>
            <SortDropdown
              options={sortOptions}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
          </div>
          {(isAdmin() || isDoctor()) && (
            <button className="add-btn" onClick={() => openModal()}>
              <FiPlus /> New Admission
            </button>
          )}
        </div>

        {/* Admissions Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admission #</th>
                <th>Patient</th>
                <th>Room/Bed</th>
                <th>Admission Date</th>
                <th>Type</th>
                <th>Attending Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmissions.map(admission => (
                <tr key={admission.id}>
                  <td>ADM-{String(admission.id).padStart(4, '0')}</td>
                  <td>{admission.patient?.firstName} {admission.patient?.lastName}</td>
                  <td>
                    {admission.room?.roomNumber || '-'}
                    {admission.bedNumber && ` / Bed ${admission.bedNumber}`}
                  </td>
                  <td>
                    {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString() : '-'}
                    {admission.admissionTime && ` ${admission.admissionTime}`}
                  </td>
                  <td>
                    <span className={`type-badge ${getAdmissionTypeClass(admission.admissionType)}`}>
                      {admission.admissionType}
                    </span>
                  </td>
                  <td>Dr. {admission.admittingDoctor?.firstName} {admission.admittingDoctor?.lastName}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(admission.status)}`}>
                      {admission.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {admission.status === 'ADMITTED' && (isAdmin() || isDoctor()) && (
                        <button
                          className="action-btn discharge"
                          onClick={() => openDischargeModal(admission)}
                          title="Discharge Patient"
                        >
                          <FiUserX />
                        </button>
                      )}
                      {admission.status === 'DISCHARGED' && (
                        <button
                          className="action-btn download"
                          onClick={() => downloadAdmissionReport(admission.id)}
                          title="Download Summary"
                        >
                          <FiDownload />
                        </button>
                      )}
                      {(isAdmin() || isDoctor()) && (
                        <>
                          <button className="action-btn edit" onClick={() => openModal(admission)}>
                            <FiEdit2 />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(admission.id)}>
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {!loading && filteredAdmissions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAdmissions.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredAdmissions.length}
              itemsPerPage={itemsPerPage}
            />
          )}
          {filteredAdmissions.length === 0 && (
            <div className="empty-state">No admissions found</div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <FilterModal
            filters={filterConfig}
            activeFilters={activeFilters}
            onApply={(filters) => {
              setActiveFilters(filters);
              setShowFilterModal(false);
            }}
            onClose={() => setShowFilterModal(false)}
          />
        )}

        {/* New/Edit Admission Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAdmission ? 'Edit Admission' : 'New Admission'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {!editingAdmission && (
                    <>
                      <div className="form-group">
                        <label>Patient *</label>
                        <select
                          value={formData.patientId}
                          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                          required
                        >
                          <option value="">Select Patient</option>
                          {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Attending Doctor *</label>
                        <select
                          value={formData.doctorId}
                          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                          required
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Room *</label>
                        <select
                          value={formData.roomId}
                          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                          required
                        >
                          <option value="">Select Room</option>
                          {rooms.filter(r => r.isAvailable).map(room => (
                            <option key={room.id} value={room.id}>
                              {room.roomNumber} - {room.roomType} ({room.capacity} beds)
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Bed Number</label>
                    <input
                      type="text"
                      value={formData.bedNumber}
                      onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                      placeholder="e.g., A1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Admission Date *</label>
                    <input
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admission Time</label>
                    <input
                      type="time"
                      value={formData.admissionTime}
                      onChange={(e) => setFormData({ ...formData, admissionTime: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admission Type *</label>
                    <select
                      value={formData.admissionType}
                      onChange={(e) => setFormData({ ...formData, admissionType: e.target.value })}
                      required
                    >
                      <option value="MEDICAL">Medical</option>
                      <option value="SURGICAL">Surgical</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="ELECTIVE">Elective</option>
                      <option value="MATERNITY">Maternity</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Diagnosis</label>
                    <textarea
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      rows={2}
                      placeholder="Primary diagnosis..."
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingAdmission ? 'Update' : 'Admit Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discharge Modal */}
        {showDischargeModal && dischargingAdmission && (
          <div className="modal-overlay" onClick={closeDischargeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Discharge Patient</h2>
                <button className="btn-close" onClick={closeDischargeModal}><FiX /></button>
              </div>
              <div className="discharge-info">
                <p><strong>Patient:</strong> {dischargingAdmission.patient?.firstName} {dischargingAdmission.patient?.lastName}</p>
                <p><strong>Room:</strong> {dischargingAdmission.room?.roomNumber} / Bed {dischargingAdmission.bedNumber}</p>
                <p><strong>Admitted:</strong> {new Date(dischargingAdmission.admissionDate).toLocaleDateString()}</p>
              </div>
              <form onSubmit={handleDischarge}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Discharge Summary *</label>
                    <textarea
                      value={dischargeData.dischargeSummary}
                      onChange={(e) => setDischargeData({ ...dischargeData, dischargeSummary: e.target.value })}
                      rows={4}
                      required
                      placeholder="Enter discharge summary, instructions, and follow-up notes..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeDischargeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">Discharge Patient</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;
