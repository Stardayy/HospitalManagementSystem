import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiActivity, FiHeart, FiThermometer, FiDroplet } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';

const VitalSigns = () => {
  const { isAdmin, isDoctor, isPatient } = useAuth();
  const [vitals, setVitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVital, setEditingVital] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bloodGlucose: '',
    painLevel: '',
    notes: ''
  });

  useEffect(() => {
    fetchVitals();
    if (!isPatient()) {
      fetchPatients();
    }
  }, [selectedPatient]);

  const fetchVitals = async () => {
    try {
      let data;
      if (selectedPatient) {
        data = await api.get(`/vitals/patient/${selectedPatient}`);
      } else {
        data = await api.get('/vitals');
      }
      setVitals(data);
    } catch (error) {
      console.error('Error fetching vitals:', error);
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
    try {
      const payload = {
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : null,
        oxygenSaturation: formData.oxygenSaturation ? parseFloat(formData.oxygenSaturation) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        bloodGlucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : null,
        painLevel: formData.painLevel ? parseInt(formData.painLevel) : null,
        notes: formData.notes
      };

      if (editingVital) {
        await api.put(`/vitals/${editingVital.id}`, payload);
      } else {
        await api.post(`/vitals?patientId=${formData.patientId}`, payload);
      }
      fetchVitals();
      closeModal();
    } catch (error) {
      console.error('Error saving vitals:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vital signs record?')) {
      try {
        await api.delete(`/vitals/${id}`);
        fetchVitals();
      } catch (error) {
        console.error('Error deleting vitals:', error);
      }
    }
  };

  const openModal = (vital = null) => {
    if (vital) {
      setEditingVital(vital);
      setFormData({
        patientId: vital.patient?.id || '',
        temperature: vital.temperature || '',
        bloodPressureSystolic: vital.bloodPressureSystolic || '',
        bloodPressureDiastolic: vital.bloodPressureDiastolic || '',
        heartRate: vital.heartRate || '',
        respiratoryRate: vital.respiratoryRate || '',
        oxygenSaturation: vital.oxygenSaturation || '',
        weight: vital.weight || '',
        height: vital.height || '',
        bloodGlucose: vital.bloodGlucose || '',
        painLevel: vital.painLevel || '',
        notes: vital.notes || ''
      });
    } else {
      setEditingVital(null);
      setFormData({
        patientId: selectedPatient || '',
        temperature: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        bloodGlucose: '',
        painLevel: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVital(null);
  };

  const getVitalStatus = (type, value) => {
    if (!value) return '';
    switch(type) {
      case 'temperature':
        if (value < 36) return 'low';
        if (value > 37.5) return 'high';
        return 'normal';
      case 'heartRate':
        if (value < 60) return 'low';
        if (value > 100) return 'high';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'low';
        return 'normal';
      case 'bloodPressureSystolic':
        if (value < 90) return 'low';
        if (value > 140) return 'high';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const filteredVitals = vitals.filter(vital =>
    vital.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vital.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header title="Vital Signs" />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header title="Vital Signs" />

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
                placeholder="Search vitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {(isAdmin() || isDoctor()) && (
            <button className="add-btn" onClick={() => openModal()}>
              <FiPlus /> Record Vitals
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {filteredVitals.length > 0 && (
          <div className="vitals-cards">
            <div className="vital-card temperature">
              <div className="vital-icon"><FiThermometer /></div>
              <div className="vital-info">
                <span className="vital-label">Avg Temperature</span>
                <span className="vital-value">
                  {(filteredVitals.reduce((sum, v) => sum + (v.temperature || 0), 0) / 
                    filteredVitals.filter(v => v.temperature).length || 0).toFixed(1)}°C
                </span>
              </div>
            </div>
            <div className="vital-card heart-rate">
              <div className="vital-icon"><FiHeart /></div>
              <div className="vital-info">
                <span className="vital-label">Avg Heart Rate</span>
                <span className="vital-value">
                  {Math.round(filteredVitals.reduce((sum, v) => sum + (v.heartRate || 0), 0) / 
                    filteredVitals.filter(v => v.heartRate).length || 0)} bpm
                </span>
              </div>
            </div>
            <div className="vital-card oxygen">
              <div className="vital-icon"><FiDroplet /></div>
              <div className="vital-info">
                <span className="vital-label">Avg SpO2</span>
                <span className="vital-value">
                  {(filteredVitals.reduce((sum, v) => sum + (v.oxygenSaturation || 0), 0) / 
                    filteredVitals.filter(v => v.oxygenSaturation).length || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="vital-card activity">
              <div className="vital-icon"><FiActivity /></div>
              <div className="vital-info">
                <span className="vital-label">Total Records</span>
                <span className="vital-value">{filteredVitals.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Vitals Table */}
        <div className="page-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                {!isPatient() && <th>Patient</th>}
                <th>Temp (°C)</th>
                <th>BP (mmHg)</th>
                <th>HR (bpm)</th>
                <th>SpO2 (%)</th>
                <th>Resp Rate</th>
                <th>BMI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVitals.map(vital => (
                <tr key={vital.id}>
                  <td>{vital.recordedAt ? new Date(vital.recordedAt).toLocaleString() : '-'}</td>
                  {!isPatient() && <td>{vital.patient?.firstName} {vital.patient?.lastName}</td>}
                  <td className={`vital-value-cell ${getVitalStatus('temperature', vital.temperature)}`}>
                    {vital.temperature || '-'}
                  </td>
                  <td className={`vital-value-cell ${getVitalStatus('bloodPressureSystolic', vital.bloodPressureSystolic)}`}>
                    {vital.bloodPressureSystolic && vital.bloodPressureDiastolic 
                      ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}` 
                      : '-'}
                  </td>
                  <td className={`vital-value-cell ${getVitalStatus('heartRate', vital.heartRate)}`}>
                    {vital.heartRate || '-'}
                  </td>
                  <td className={`vital-value-cell ${getVitalStatus('oxygenSaturation', vital.oxygenSaturation)}`}>
                    {vital.oxygenSaturation || '-'}
                  </td>
                  <td>{vital.respiratoryRate || '-'}</td>
                  <td>{vital.bmi ? vital.bmi.toFixed(1) : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      {(isAdmin() || isDoctor()) && (
                        <>
                          <button className="action-btn edit" onClick={() => openModal(vital)}>
                            <FiEdit2 />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(vital.id)}>
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
          {filteredVitals.length === 0 && (
            <div className="empty-state">No vital signs recorded</div>
          )}
        </div>

        {/* Add/Edit Vitals Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingVital ? 'Edit Vital Signs' : 'Record Vital Signs'}</h2>
                <button className="close-btn" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {!editingVital && !isPatient() && (
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
                  
                  <div className="form-section">
                    <h4>Core Vitals</h4>
                  </div>
                  
                  <div className="form-group">
                    <label>Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                      placeholder="36.5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Pressure Systolic</label>
                    <input
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})}
                      placeholder="120"
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Pressure Diastolic</label>
                    <input
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})}
                      placeholder="80"
                    />
                  </div>
                  <div className="form-group">
                    <label>Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                      placeholder="72"
                    />
                  </div>
                  <div className="form-group">
                    <label>Respiratory Rate (/min)</label>
                    <input
                      type="number"
                      value={formData.respiratoryRate}
                      onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})}
                      placeholder="16"
                    />
                  </div>
                  <div className="form-group">
                    <label>Oxygen Saturation (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.oxygenSaturation}
                      onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})}
                      placeholder="98"
                    />
                  </div>

                  <div className="form-section">
                    <h4>Measurements</h4>
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="70"
                    />
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      placeholder="175"
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Glucose (mg/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.bloodGlucose}
                      onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pain Level (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.painLevel}
                      onChange={(e) => setFormData({...formData, painLevel: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="submit-btn">
                    {editingVital ? 'Update' : 'Record Vitals'}
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

export default VitalSigns;
