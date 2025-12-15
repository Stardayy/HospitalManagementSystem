import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiPhone, FiMail, FiAward, FiUsers, FiGrid, FiDollarSign, FiFilter } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    phone: '',
    email: '',
    licenseNumber: '',
    departmentId: '',
    consultationFee: '',
    yearsOfExperience: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await api.get('/departments');
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        phone: formData.phone,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null
      };

      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, doctorData);
        if (formData.departmentId) {
          await api.put(`/doctors/${editingDoctor.id}/department/${formData.departmentId}`, {});
        }
      } else {
        const url = formData.departmentId 
          ? `/doctors?departmentId=${formData.departmentId}` 
          : '/doctors';
        await api.post(url, doctorData);
      }
      fetchDoctors();
      closeModal();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const openModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        specialization: doctor.specialization || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        licenseNumber: doctor.licenseNumber || '',
        departmentId: doctor.department?.id || '',
        consultationFee: doctor.consultationFee || '',
        yearsOfExperience: doctor.yearsOfExperience || ''
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        firstName: '',
        lastName: '',
        specialization: '',
        phone: '',
        email: '',
        licenseNumber: '',
        departmentId: '',
        consultationFee: '',
        yearsOfExperience: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
  };

  // Get unique specializations for filter
  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const fetchFilteredDoctors = async (filters, sort = currentSort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.departmentId) params.append('departmentId', filters.departmentId);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (sort.sortBy) params.append('sortBy', sort.sortBy);
      if (sort.sortDirection) params.append('sortDirection', sort.sortDirection);
      
      const data = await api.get(`/doctors/filter?${params.toString()}`);
      setDoctors(data);
      setActiveFilters(filters);
    } catch (error) {
      console.error('Error filtering doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    const hasFilters = Object.values(filters).some(v => v !== '' && v !== false);
    if (hasFilters) {
      fetchFilteredDoctors(filters);
    } else {
      fetchDoctors();
      setActiveFilters({});
    }
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
    if (currentSort.sortBy) {
      fetchFilteredDoctors({}, currentSort);
    } else {
      fetchDoctors();
    }
  };

  const handleSort = (sort) => {
    setCurrentSort(sort);
    if (sort.sortBy || Object.keys(activeFilters).length > 0) {
      fetchFilteredDoctors(activeFilters, sort);
    } else {
      fetchDoctors();
    }
  };

  const filterConfig = [
    {
      key: 'departmentId',
      label: 'Department',
      type: 'select',
      options: departments.map(dept => ({ value: dept.id.toString(), label: dept.name }))
    },
    {
      key: 'specialization',
      label: 'Specialization',
      type: 'select',
      options: specializations.map(spec => ({ value: spec, label: spec }))
    }
  ];

  const sortOptions = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'specialization', label: 'Specialization' },
    { value: 'yearsOfExperience', label: 'Years of Experience' },
    { value: 'consultationFee', label: 'Consultation Fee' },
    { value: 'id', label: 'ID' }
  ];

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search doctors..." />

        <div className="page-header">
          <h1>Doctors</h1>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-icon">
              <FiUsers size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{doctors.length}</span>
              <span className="stat-label">Total Doctors</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', color: '#4f46e5' }}>
              <FiGrid size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{departments.length}</span>
              <span className="stat-label">Departments</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
              <FiAward size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{doctors.length > 0 ? Math.round(doctors.reduce((sum, d) => sum + (d.yearsOfExperience || 0), 0) / doctors.length) : 0}</span>
              <span className="stat-label">Avg. Experience</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#059669' }}>
              <FiDollarSign size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">${doctors.length > 0 ? Math.round(doctors.reduce((sum, d) => sum + (d.consultationFee || 0), 0) / doctors.length) : 0}</span>
              <span className="stat-label">Avg. Fee</span>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <button className="btn-filter" onClick={() => setShowFilterModal(true)}>
            <FiFilter /> Filter
            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
          <SortDropdown
            sortOptions={sortOptions}
            onSort={handleSort}
            currentSort={currentSort}
          />
          {activeFilterCount > 0 && (
            <button className="btn-clear-filter" onClick={clearFilters}>
              <FiX /> Clear Filters
            </button>
          )}
          <button className="btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Doctor
          </button>
        </div>

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          title="Filter Doctors"
        />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>License No.</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.id}</td>
                    <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                    <td>{doctor.specialization || 'General Physician'}</td>
                    <td>
                      <span className="department-badge">
                        {doctor.department?.name || 'No Department'}
                      </span>
                    </td>
                    <td>{doctor.phone || 'N/A'}</td>
                    <td>{doctor.email || 'N/A'}</td>
                    <td>{doctor.licenseNumber || 'N/A'}</td>
                    <td>{doctor.yearsOfExperience || 0} years</td>
                    <td>${doctor.consultationFee || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" onClick={() => openModal(doctor)}>
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(doctor.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDoctors.length === 0 && (
              <div className="no-data">No doctors found</div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingDoctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="e.g., Cardiology, Neurology"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Consultation Fee ($)</label>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingDoctor ? 'Update' : 'Create'}
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

export default Doctors;
