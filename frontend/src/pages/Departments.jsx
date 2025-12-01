import React, { useState, useEffect } from 'react';
import { FiSearch, FiSettings, FiBell, FiPlus, FiEdit2, FiTrash2, FiX, FiMapPin, FiPhone, FiUsers, FiGrid } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import CustomSelect from '../component/CustomSelect';
import '../styles/Pages.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await api.get('/departments');
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      fetchDepartments();
      closeModal();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const openModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        name: department.name || '',
        description: department.description || '',
        location: department.location || '',
        phone: department.phone || ''
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        name: '',
        description: '',
        location: '',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
  };

  // Get unique locations for filter
  const locations = [...new Set(departments.map(d => d.location).filter(Boolean))];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = 
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'ALL' || dept.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const departmentColors = ['#6ee7b7', '#93c5fd', '#fca5a5', '#fcd34d', '#c4b5fd', '#f9a8d4'];

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search departments..." 
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
          <h1>Departments</h1>
          <button className="btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Department
          </button>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-icon">
              <FiGrid size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{departments.length}</span>
              <span className="stat-label">Total Departments</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
              <FiUsers size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {departments.reduce((sum, d) => sum + (d.doctors?.length || 0), 0)}
              </span>
              <span className="stat-label">Total Doctors</span>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <CustomSelect
            options={[
              { value: 'ALL', label: 'All Locations' },
              ...locations.map(loc => ({ value: loc, label: loc }))
            ]}
            value={filterLocation}
            onChange={setFilterLocation}
            placeholder="Filter by location"
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
                  <th>Department</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Doctors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>{dept.description || 'No description'}</td>
                    <td>{dept.location || 'N/A'}</td>
                    <td>{dept.phone || 'N/A'}</td>
                    <td>
                      <span className="badge-count">{dept.doctors?.length || 0}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" onClick={() => openModal(dept)}>
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(dept.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDepartments.length === 0 && (
              <div className="no-data">No departments found</div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingDepartment ? 'Edit Department' : 'Add Department'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Department Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="e.g., Cardiology, Emergency"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      placeholder="Department description..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Building A, Floor 2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Department phone"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingDepartment ? 'Update' : 'Create'}
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

export default Departments;
