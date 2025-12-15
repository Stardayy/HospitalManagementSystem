import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiSearch, FiDownload, FiFile, FiImage, FiFileText, FiFilter, FiUpload, FiLock } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';
import '../styles/FilterModal.css';

const Documents = () => {
  const { isAdmin, isDoctor, isPatient } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedPatient, setSelectedPatient] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    documentType: 'OTHER',
    description: '',
    isConfidential: false,
    file: null
  });

  useEffect(() => {
    fetchDocuments();
    if (!isPatient()) {
      fetchPatients();
    }
  }, [selectedPatient]);

  const fetchDocuments = async () => {
    try {
      let data;
      if (selectedPatient) {
        data = await api.get(`/documents/patient/${selectedPatient}`);
      } else {
        data = await api.get('/documents');
      }
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('documentType', formData.documentType);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('isConfidential', formData.isConfidential);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/documents/upload?patientId=${formData.patientId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      fetchDocuments();
      closeModal();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const downloadDocument = async (doc) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/documents/${doc.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalFileName || doc.fileName;
      a.click();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const openModal = () => {
    setFormData({
      patientId: selectedPatient || '',
      documentType: 'OTHER',
      description: '',
      isConfidential: false,
      file: null
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      patientId: '',
      documentType: 'OTHER',
      description: '',
      isConfidential: false,
      file: null
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FiFile />;
    if (fileType.startsWith('image/')) return <FiImage />;
    if (fileType.includes('pdf')) return <FiFileText />;
    return <FiFile />;
  };

  const getDocumentTypeLabel = (type) => {
    switch(type) {
      case 'LAB_REPORT': return 'Lab Report';
      case 'PRESCRIPTION': return 'Prescription';
      case 'XRAY': return 'X-Ray';
      case 'MRI': return 'MRI';
      case 'CT_SCAN': return 'CT Scan';
      case 'ULTRASOUND': return 'Ultrasound';
      case 'DISCHARGE_SUMMARY': return 'Discharge Summary';
      case 'CONSENT_FORM': return 'Consent Form';
      case 'INSURANCE': return 'Insurance';
      case 'IDENTIFICATION': return 'Identification';
      default: return 'Other';
    }
  };

  const getDocumentTypeClass = (type) => {
    switch(type) {
      case 'LAB_REPORT': return 'doc-lab';
      case 'PRESCRIPTION': return 'doc-prescription';
      case 'XRAY': 
      case 'MRI': 
      case 'CT_SCAN':
      case 'ULTRASOUND': return 'doc-imaging';
      case 'DISCHARGE_SUMMARY': return 'doc-discharge';
      default: return 'doc-other';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !activeFilters.documentType || doc.documentType === activeFilters.documentType;
    
    return matchesSearch && matchesType;
  });

  const filterConfig = [
    {
      name: 'documentType',
      label: 'Document Type',
      type: 'select',
      options: [
        { value: 'LAB_REPORT', label: 'Lab Report' },
        { value: 'PRESCRIPTION', label: 'Prescription' },
        { value: 'XRAY', label: 'X-Ray' },
        { value: 'MRI', label: 'MRI' },
        { value: 'CT_SCAN', label: 'CT Scan' },
        { value: 'ULTRASOUND', label: 'Ultrasound' },
        { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
        { value: 'CONSENT_FORM', label: 'Consent Form' },
        { value: 'INSURANCE', label: 'Insurance' },
        { value: 'IDENTIFICATION', label: 'Identification' },
        { value: 'OTHER', label: 'Other' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header title="Documents" />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header title="Documents" />

        {/* Toolbar */}
        <div className="page-toolbar">
          <div className="search-filter">
            {!isPatient() && (
              <select
                className="patient-select"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">All Patients</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            )}
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
              <FiFilter /> Filter
            </button>
          </div>
          {(isAdmin() || isDoctor()) && (
            <button className="add-btn" onClick={openModal}>
              <FiUpload /> Upload Document
            </button>
          )}
        </div>

        {/* Documents Grid */}
        <div className="page-content">
          <div className="documents-grid">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="document-icon">
                  {getFileIcon(doc.fileType)}
                  {doc.isConfidential && <span className="confidential-badge"><FiLock /></span>}
                </div>
                <div className="document-info">
                  <h4 className="document-name" title={doc.originalFileName}>
                    {doc.originalFileName || doc.fileName}
                  </h4>
                  <span className={`document-type ${getDocumentTypeClass(doc.documentType)}`}>
                    {getDocumentTypeLabel(doc.documentType)}
                  </span>
                  {!isPatient() && doc.patient && (
                    <p className="document-patient">
                      {doc.patient.firstName} {doc.patient.lastName}
                    </p>
                  )}
                  <p className="document-meta">
                    {formatFileSize(doc.fileSize)} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '-'}
                  </p>
                  {doc.description && (
                    <p className="document-description">{doc.description}</p>
                  )}
                </div>
                <div className="document-actions">
                  <button 
                    className="action-btn download" 
                    onClick={() => downloadDocument(doc)}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                  {(isAdmin() || isDoctor()) && (
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDelete(doc.id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filteredDocuments.length === 0 && (
            <div className="empty-state">No documents found</div>
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

        {/* Upload Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Upload Document</h2>
                <button className="close-btn" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {!isPatient() && (
                    <div className="form-group full-width">
                      <label>Patient *</label>
                      <select
                        value={formData.patientId}
                        onChange={(e) => setFormData({...formData, patientId: e.target.value})}
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
                  )}
                  <div className="form-group full-width">
                    <label>File *</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="file-input"
                        onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                        required
                      />
                      <label htmlFor="file-input" className="file-upload-label">
                        <FiUpload />
                        <span>{formData.file ? formData.file.name : 'Click to select file'}</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Document Type *</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                      required
                    >
                      <option value="LAB_REPORT">Lab Report</option>
                      <option value="PRESCRIPTION">Prescription</option>
                      <option value="XRAY">X-Ray</option>
                      <option value="MRI">MRI</option>
                      <option value="CT_SCAN">CT Scan</option>
                      <option value="ULTRASOUND">Ultrasound</option>
                      <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                      <option value="CONSENT_FORM">Consent Form</option>
                      <option value="INSURANCE">Insurance</option>
                      <option value="IDENTIFICATION">Identification</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isConfidential}
                        onChange={(e) => setFormData({...formData, isConfidential: e.target.checked})}
                      />
                      Mark as Confidential
                    </label>
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      placeholder="Optional description..."
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
