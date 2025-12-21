import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiPhone, FiMail, FiUsers, FiUser, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await api.get('/patients');
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient.id}`, formData);
      } else {
        await api.post('/patients', formData);
      }
      fetchPatients();
      closeModal();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        bloodType: patient.bloodType || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || ''
      });
    } else {
      setEditingPatient(null);
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        bloodType: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
  };

  const fetchFilteredPatients = async (filters, sort = currentSort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.bloodType) params.append('bloodType', filters.bloodType);
      if (sort.sortBy) params.append('sortBy', sort.sortBy);
      if (sort.sortDirection) params.append('sortDirection', sort.sortDirection);

      const data = await api.get(`/patients/filter?${params.toString()}`);
      setPatients(data);
      setActiveFilters(filters);
    } catch (error) {
      console.error('Error filtering patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    const hasFilters = Object.values(filters).some(v => v !== '' && v !== false);
    if (hasFilters) {
      fetchFilteredPatients(filters);
    } else {
      fetchPatients();
      setActiveFilters({});
    }
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
    if (currentSort.sortBy) {
      fetchFilteredPatients({}, currentSort);
    } else {
      fetchPatients();
    }
  };

  const handleSort = (sort) => {
    setCurrentSort(sort);
    if (sort.sortBy || Object.keys(activeFilters).length > 0) {
      fetchFilteredPatients(activeFilters, sort);
    } else {
      fetchPatients();
    }
  };

  const filterConfig = [
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      key: 'bloodType',
      label: 'Blood Type',
      type: 'select',
      options: [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ]
    }
  ];

  const sortOptions = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'dateOfBirth', label: 'Date of Birth' },
    { value: 'gender', label: 'Gender' },
    { value: 'bloodType', label: 'Blood Type' },
    { value: 'id', label: 'ID' }
  ];

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    return matchesSearch;
  });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, currentSort]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <Header pageTitle="Patients" />

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FiUsers />
            </div>
            <div className="stat-info">
              <span className="stat-value">{patients.length}</span>
              <span className="stat-label">Total Patients</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <FiUser />
            </div>
            <div className="stat-info">
              <span className="stat-value">{patients.filter(p => p.gender === 'Male').length}</span>
              <span className="stat-label">Male</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pink">
              <FiUser />
            </div>
            <div className="stat-info">
              <span className="stat-value">{patients.filter(p => p.gender === 'Female').length}</span>
              <span className="stat-label">Female</span>
            </div>
          </div>
        </div>

        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
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
          </div>
          <button className="add-btn" onClick={() => openModal()}>
            <FiPlus /> Add Patient
          </button>
        </div>

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          title="Filter Patients"
        />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Date of Birth</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Blood Type</th>
                  <th>Emergency Contact</th>
                  <th>Emergency Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.dateOfBirth || '-'}</td>
                    <td>{calculateAge(patient.dateOfBirth)}</td>
                    <td>{patient.gender || '-'}</td>
                    <td>{patient.phone || '-'}</td>
                    <td>{patient.email || '-'}</td>
                    <td>{patient.address || '-'}</td>
                    <td>
                      <span className="blood-type-badge">{patient.bloodType || '-'}</span>
                    </td>
                    <td>{patient.emergencyContact || '-'}</td>
                    <td>{patient.emergencyPhone || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" onClick={() => openModal(patient)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(patient.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedPatients.length === 0 && (
              <div className="no-data">No patients found matching your search.</div>
            )}
          </div>
        )}
        {/* Pagination */}
        {!loading && filteredPatients.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredPatients.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredPatients.length}
            itemsPerPage={itemsPerPage}
          />
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingPatient ? 'Edit Patient' : 'Add Patient'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Type</label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingPatient ? 'Update' : 'Create'}
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

export default Patients;
