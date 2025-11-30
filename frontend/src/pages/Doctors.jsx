import React, { useState, useEffect } from 'react';
import { FiSearch, FiSettings, FiBell, FiPlus, FiEdit2, FiTrash2, FiX, FiPhone, FiMail, FiAward } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import '../styles/Pages.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'ALL' || 
      doctor.department?.id?.toString() === filterDepartment;
    return matchesSearch && matchesDepartment;
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
              placeholder="Search doctors..." 
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
          <h1>Doctors</h1>
          <button className="btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Doctor
          </button>
        </div>

        <div className="filter-bar">
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="ALL">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

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
