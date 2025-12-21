import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiFileText, FiCalendar, FiUser, FiFilter, FiSearch, FiDownload } from 'react-icons/fi';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import Pagination from '../component/Pagination';
import api from '../api/api';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/DropdownFix.css';
import '../styles/SortDropdown.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({});
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

  const handleDownloadPDF = async (recordId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/reports/medical-record/${recordId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical_record_${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF');
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

    const matchesSearch = patientName.includes(term) || doctorName.includes(term) || diagnosis.includes(term);

    // Apply active filters
    const matchesPatient = !activeFilters.patientId || record.patient?.id?.toString() === activeFilters.patientId;
    const matchesDoctor = !activeFilters.doctorId || record.doctor?.id?.toString() === activeFilters.doctorId;
    const matchesStartDate = !activeFilters.startDate || new Date(record.recordDate) >= new Date(activeFilters.startDate);
    const matchesEndDate = !activeFilters.endDate || new Date(record.recordDate) <= new Date(activeFilters.endDate);

    return matchesSearch && matchesPatient && matchesDoctor && matchesStartDate && matchesEndDate;
  });

  // Sort the filtered records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!currentSort.sortBy) return 0;

    let aValue, bValue;
    switch (currentSort.sortBy) {
      case 'date':
        aValue = new Date(a.recordDate);
        bValue = new Date(b.recordDate);
        break;
      case 'patient':
        aValue = `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.toLowerCase();
        bValue = `${b.patient?.firstName || ''} ${b.patient?.lastName || ''}`.toLowerCase();
        break;
      case 'doctor':
        aValue = `${a.doctor?.firstName || ''} ${a.doctor?.lastName || ''}`.toLowerCase();
        bValue = `${b.doctor?.firstName || ''} ${b.doctor?.lastName || ''}`.toLowerCase();
        break;
      case 'diagnosis':
        aValue = (a.diagnosis || '').toLowerCase();
        bValue = (b.diagnosis || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return currentSort.sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return currentSort.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRecords = sortedRecords.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, currentSort]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const handleSort = (sort) => {
    setCurrentSort(sort);
  };

  const filterConfig = [
    {
      key: 'patientId',
      label: 'Patient',
      type: 'select',
      options: patients.map(p => ({ value: p.id.toString(), label: `${p.firstName} ${p.lastName}` }))
    },
    {
      key: 'doctorId',
      label: 'Doctor',
      type: 'select',
      options: doctors.map(d => ({ value: d.id.toString(), label: `Dr. ${d.firstName} ${d.lastName}` }))
    },
    {
      key: 'startDate',
      label: 'Start Date',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'End Date',
      type: 'date'
    }
  ];

  const sortOptions = [
    { value: 'date', label: 'Record Date' },
    { value: 'patient', label: 'Patient Name' },
    { value: 'doctor', label: 'Doctor Name' },
    { value: 'diagnosis', label: 'Diagnosis' }
  ];

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <Header pageTitle="Medical Records" />

        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search records..."
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
          <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
            <FiPlus /> Add Record
          </button>
        </div>

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          title="Filter Medical Records"
        />

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
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No medical records found</td>
                  </tr>
                ) : (
                  paginatedRecords.map(record => (
                    <tr key={record.id}>
                      <td>{formatDate(record.recordDate)}</td>
                      <td>
                        {record.patient?.firstName} {record.patient?.lastName}
                      </td>
                      <td>Dr. {record.doctor?.firstName} {record.doctor?.lastName}</td>
                      <td className="diagnosis-cell">{record.diagnosis || 'N/A'}</td>
                      <td className="treatment-cell">{record.treatment?.substring(0, 50) || 'N/A'}...</td>
                      <td className="actions-cell">
                        <button className="btn-icon btn-view" onClick={() => handleView(record)} title="View">
                          <FiEye />
                        </button>
                        <button className="btn-icon btn-info" onClick={() => handleDownloadPDF(record.id)} title="Download PDF">
                          <FiDownload />
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
            <div className="modal modal-large edit-record-modal">
              <div className="modal-header edit-record-header">
                <div className="edit-record-title">
                  <div className="edit-record-icon">
                    {editingRecord ? <FiEdit2 /> : <FiPlus />}
                  </div>
                  <div>
                    <h2>{editingRecord ? 'Edit Medical Record' : 'New Medical Record'}</h2>
                    <span className="edit-record-subtitle">
                      {editingRecord ? `Record #${editingRecord.id}` : 'Create a new patient medical record'}
                    </span>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="edit-record-form">
                <div className="record-details-content">
                  {/* Info Cards - Same as View Modal */}
                  <div className="record-info-cards edit-info-cards">
                    <div className="record-info-card">
                      <div className="info-card-icon patient-icon">
                        <FiUser />
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">Patient <span className="required">*</span></span>
                        <select
                          name="patientId"
                          value={formData.patientId}
                          onChange={handleInputChange}
                          required
                          className="info-card-select"
                        >
                          <option value="">Select Patient</option>
                          {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="record-info-card">
                      <div className="info-card-icon doctor-icon">
                        <FiUser />
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">Doctor <span className="required">*</span></span>
                        <select
                          name="doctorId"
                          value={formData.doctorId}
                          onChange={handleInputChange}
                          required
                          className="info-card-select"
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="record-info-card">
                      <div className="info-card-icon date-icon">
                        <FiCalendar />
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">Record Date <span className="required">*</span></span>
                        <input
                          type="date"
                          name="recordDate"
                          value={formData.recordDate}
                          onChange={handleInputChange}
                          required
                          className="info-card-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sections - Same structure as View Modal */}
                  <div className="record-sections">
                    <div className="record-section diagnosis-section">
                      <div className="section-header">
                        <span className="section-icon">🩺</span>
                        <h3>Diagnosis <span className="required">*</span></h3>
                      </div>
                      <div className="section-content edit-section-content">
                        <input
                          type="text"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                          placeholder="Enter the patient's diagnosis..."
                          required
                          className="section-input"
                        />
                      </div>
                    </div>

                    <div className="record-section treatment-section">
                      <div className="section-header">
                        <span className="section-icon">💊</span>
                        <h3>Treatment Plan <span className="required">*</span></h3>
                      </div>
                      <div className="section-content edit-section-content">
                        <textarea
                          name="treatment"
                          value={formData.treatment}
                          onChange={handleInputChange}
                          placeholder="Describe the treatment plan in detail..."
                          rows="3"
                          required
                          className="section-input"
                        />
                      </div>
                    </div>

                    <div className="record-section prescription-section">
                      <div className="section-header">
                        <span className="section-icon">📋</span>
                        <h3>Prescription</h3>
                      </div>
                      <div className="section-content edit-section-content">
                        <textarea
                          name="prescription"
                          value={formData.prescription}
                          onChange={handleInputChange}
                          placeholder="Enter medications and dosages..."
                          rows="3"
                          className="section-input"
                        />
                      </div>
                    </div>

                    <div className="record-section notes-section">
                      <div className="section-header">
                        <span className="section-icon">📝</span>
                        <h3>Additional Notes</h3>
                      </div>
                      <div className="section-content edit-section-content">
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any additional observations..."
                          rows="3"
                          className="section-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer edit-record-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    <FiX /> Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingRecord ? <><FiEdit2 /> Update Record</> : <><FiPlus /> Create Record</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewingRecord && (
          <div className="modal-overlay">
            <div className="modal modal-large view-record-modal">
              <div className="modal-header view-record-header">
                <div className="view-record-title">
                  <div className="view-record-icon">
                    <FiFileText />
                  </div>
                  <div>
                    <h2>Medical Record</h2>
                    <span className="record-id">Record #{viewingRecord.id}</span>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setShowViewModal(false)}>
                  <FiX />
                </button>
              </div>

              <div className="record-details-content">
                <div className="record-info-cards">
                  <div className="record-info-card">
                    <div className="info-card-icon date-icon">
                      <FiCalendar />
                    </div>
                    <div className="info-card-content">
                      <span className="info-label">Record Date</span>
                      <span className="info-value">{formatDate(viewingRecord.recordDate)}</span>
                    </div>
                  </div>
                  <div className="record-info-card">
                    <div className="info-card-icon patient-icon">
                      <FiUser />
                    </div>
                    <div className="info-card-content">
                      <span className="info-label">Patient</span>
                      <span className="info-value">{viewingRecord.patient?.firstName} {viewingRecord.patient?.lastName}</span>
                    </div>
                  </div>
                  <div className="record-info-card">
                    <div className="info-card-icon doctor-icon">
                      <FiUser />
                    </div>
                    <div className="info-card-content">
                      <span className="info-label">Attending Doctor</span>
                      <span className="info-value">Dr. {viewingRecord.doctor?.firstName} {viewingRecord.doctor?.lastName}</span>
                    </div>
                  </div>
                </div>

                <div className="record-sections">
                  <div className="record-section diagnosis-section">
                    <div className="section-header">
                      <span className="section-icon diagnosis-icon">🩺</span>
                      <h3>Diagnosis</h3>
                    </div>
                    <div className="section-content">
                      <p>{viewingRecord.diagnosis || 'No diagnosis recorded'}</p>
                    </div>
                  </div>

                  <div className="record-section treatment-section">
                    <div className="section-header">
                      <span className="section-icon treatment-icon">💊</span>
                      <h3>Treatment Plan</h3>
                    </div>
                    <div className="section-content">
                      <p>{viewingRecord.treatment || 'No treatment recorded'}</p>
                    </div>
                  </div>

                  <div className="record-section prescription-section">
                    <div className="section-header">
                      <span className="section-icon prescription-icon">📋</span>
                      <h3>Prescription</h3>
                    </div>
                    <div className="section-content">
                      <p>{viewingRecord.prescription || 'No prescription recorded'}</p>
                    </div>
                  </div>

                  <div className="record-section notes-section">
                    <div className="section-header">
                      <span className="section-icon notes-icon">📝</span>
                      <h3>Additional Notes</h3>
                    </div>
                    <div className="section-content">
                      <p>{viewingRecord.notes || 'No additional notes'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer view-record-actions">
                <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                  <FiX /> Close
                </button>
                <button className="btn-primary" onClick={() => { setShowViewModal(false); handleEdit(viewingRecord); }}>
                  <FiEdit2 /> Edit Record
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalRecords;
