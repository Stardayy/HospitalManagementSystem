import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiFileText, FiCalendar, FiUser } from 'react-icons/fi';
import Layout from '../component/Layout';
import api from '../api/api';
import '../styles/Pages.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    recordDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, patientsData, doctorsData] = await Promise.all([
        api.get('/medical-records'),
        api.get('/patients'),
        api.get('/doctors')
      ]);
      setRecords(recordsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await api.put(`/medical-records/${editingRecord.id}`, formData);
        toast.success('Medical record updated successfully');
      } else {
        await api.post('/medical-records', formData);
        toast.success('Medical record created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving medical record:', error);
      toast.error(error.message || 'Failed to save medical record');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      patientId: record.patient?.id || '',
      doctorId: record.doctor?.id || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescription: record.prescription || '',
      notes: record.notes || '',
      recordDate: record.recordDate || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await api.delete(`/medical-records/${id}`);
        toast.success('Medical record deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting medical record:', error);
        toast.error('Failed to delete medical record');
      }
    }
  };

  const resetForm = () => {
    setEditingRecord(null);
    setFormData({
      patientId: '',
      doctorId: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      notes: '',
      recordDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredRecords = records.filter(record => {
    const patientName = `${record.patient?.firstName || ''} ${record.patient?.lastName || ''}`.toLowerCase();
    const doctorName = `${record.doctor?.firstName || ''} ${record.doctor?.lastName || ''}`.toLowerCase();
    const diagnosis = (record.diagnosis || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return patientName.includes(term) || doctorName.includes(term) || diagnosis.includes(term);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1><FiFileText /> Medical Records</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FiPlus /> Add Record
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No medical records found</td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id}>
                      <td>{formatDate(record.recordDate)}</td>
                      <td>
                        <div className="user-cell">
                          <FiUser className="user-icon" />
                          {record.patient?.firstName} {record.patient?.lastName}
                        </div>
                      </td>
                      <td>Dr. {record.doctor?.firstName} {record.doctor?.lastName}</td>
                      <td className="diagnosis-cell">{record.diagnosis || 'N/A'}</td>
                      <td className="treatment-cell">{record.treatment?.substring(0, 50) || 'N/A'}...</td>
                      <td className="actions-cell">
                        <button className="btn-icon btn-view" onClick={() => handleView(record)} title="View">
                          <FiEye />
                        </button>
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(record)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(record.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h2>{editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}</h2>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient *</label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
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
                    <label>Doctor *</label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Record Date *</label>
                    <input
                      type="date"
                      name="recordDate"
                      value={formData.recordDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Diagnosis *</label>
                    <input
                      type="text"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      placeholder="Enter diagnosis"
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Treatment *</label>
                    <textarea
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      placeholder="Enter treatment details"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Prescription</label>
                    <textarea
                      name="prescription"
                      value={formData.prescription}
                      onChange={handleInputChange}
                      placeholder="Enter prescription details"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes"
                      rows="2"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingRecord ? 'Update Record' : 'Create Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewingRecord && (
          <div className="modal-overlay">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h2><FiFileText /> Medical Record Details</h2>
                <button className="btn-close" onClick={() => setShowViewModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="record-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label><FiCalendar /> Date</label>
                    <span>{formatDate(viewingRecord.recordDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label><FiUser /> Patient</label>
                    <span>{viewingRecord.patient?.firstName} {viewingRecord.patient?.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label><FiUser /> Doctor</label>
                    <span>Dr. {viewingRecord.doctor?.firstName} {viewingRecord.doctor?.lastName}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <label>Diagnosis</label>
                  <p>{viewingRecord.diagnosis || 'N/A'}</p>
                </div>
                <div className="detail-section">
                  <label>Treatment</label>
                  <p>{viewingRecord.treatment || 'N/A'}</p>
                </div>
                <div className="detail-section">
                  <label>Prescription</label>
                  <p>{viewingRecord.prescription || 'N/A'}</p>
                </div>
                <div className="detail-section">
                  <label>Notes</label>
                  <p>{viewingRecord.notes || 'N/A'}</p>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicalRecords;
