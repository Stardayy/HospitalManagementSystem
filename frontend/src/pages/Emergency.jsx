import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiSearch, FiEdit2, FiFilter, FiAlertTriangle, FiPlay, FiCheckCircle } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';

const Emergency = () => {
    const { isAdmin, isDoctor } = useAuth();
    const [cases, setCases] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [editingCase, setEditingCase] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '', patientName: '', patientAge: '', patientGender: '', patientPhone: '',
        chiefComplaint: '', triageLevel: 'LEVEL_3_URGENT', vitalSigns: '', initialAssessment: '',
        assignedDoctorId: '', treatmentArea: '', bedNumber: '', notes: '', ambulanceArrival: false
    });

    const triageLevels = [
        { value: 'LEVEL_1_RESUSCITATION', label: '1 - Resuscitation (Immediate)' },
        { value: 'LEVEL_2_EMERGENCY', label: '2 - Emergency (High Risk)' },
        { value: 'LEVEL_3_URGENT', label: '3 - Urgent (Stable)' },
        { value: 'LEVEL_4_LESS_URGENT', label: '4 - Less Urgent' },
        { value: 'LEVEL_5_NON_URGENT', label: '5 - Non-Urgent' }
    ];

    const statuses = ['WAITING', 'TRIAGE', 'IN_TREATMENT', 'OBSERVATION', 'ADMITTED', 'DISCHARGED', 'TRANSFERRED'];

    useEffect(() => {
        fetchCases();
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchCases = async () => {
        try {
            const data = await api.get('/emergency/active');
            setCases(data);
        } catch (error) {
            console.error('Error fetching cases:', error);
            try {
                const allData = await api.get('/emergency');
                setCases(allData);
            } catch (e) {
                console.error('Error fetching all cases:', e);
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const caseData = {
                patient: formData.patientId ? { id: parseInt(formData.patientId) } : null,
                patientName: formData.patientName || null,
                patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
                patientGender: formData.patientGender || null,
                patientPhone: formData.patientPhone || null,
                chiefComplaint: formData.chiefComplaint,
                triageLevel: formData.triageLevel,
                vitalSigns: formData.vitalSigns,
                initialAssessment: formData.initialAssessment,
                assignedDoctor: formData.assignedDoctorId ? { id: parseInt(formData.assignedDoctorId) } : null,
                treatmentArea: formData.treatmentArea,
                bedNumber: formData.bedNumber,
                notes: formData.notes,
                ambulanceArrival: formData.ambulanceArrival
            };

            if (editingCase) {
                await api.put(`/emergency/${editingCase.id}`, caseData);
            } else {
                await api.post('/emergency', caseData);
            }
            fetchCases();
            closeModal();
        } catch (error) {
            console.error('Error saving case:', error);
            alert('Failed to save case');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await api.delete(`/emergency/${id}`);
                fetchCases();
            } catch (error) {
                console.error('Error deleting case:', error);
            }
        }
    };

    const handleStartTriage = async (id) => {
        try {
            await api.put(`/emergency/${id}/triage`);
            fetchCases();
        } catch (error) {
            console.error('Error starting triage:', error);
        }
    };

    const handleStartTreatment = async (id) => {
        try {
            await api.put(`/emergency/${id}/start-treatment`);
            fetchCases();
        } catch (error) {
            console.error('Error starting treatment:', error);
        }
    };

    const handleDischarge = async (id) => {
        const disposition = prompt('Enter discharge disposition (e.g., "Discharged home", "Admitted to Ward 3"):');
        if (disposition) {
            try {
                await api.put(`/emergency/${id}/discharge?disposition=${encodeURIComponent(disposition)}`);
                fetchCases();
            } catch (error) {
                console.error('Error discharging patient:', error);
            }
        }
    };

    const openModal = (emergencyCase = null) => {
        if (emergencyCase) {
            setEditingCase(emergencyCase);
            setFormData({
                patientId: emergencyCase.patient?.id || '',
                patientName: emergencyCase.patientName || '',
                patientAge: emergencyCase.patientAge || '',
                patientGender: emergencyCase.patientGender || '',
                patientPhone: emergencyCase.patientPhone || '',
                chiefComplaint: emergencyCase.chiefComplaint || '',
                triageLevel: emergencyCase.triageLevel || 'LEVEL_3_URGENT',
                vitalSigns: emergencyCase.vitalSigns || '',
                initialAssessment: emergencyCase.initialAssessment || '',
                assignedDoctorId: emergencyCase.assignedDoctor?.id || '',
                treatmentArea: emergencyCase.treatmentArea || '',
                bedNumber: emergencyCase.bedNumber || '',
                notes: emergencyCase.notes || '',
                ambulanceArrival: emergencyCase.ambulanceArrival || false
            });
        } else {
            setEditingCase(null);
            setFormData({
                patientId: '', patientName: '', patientAge: '', patientGender: '', patientPhone: '',
                chiefComplaint: '', triageLevel: 'LEVEL_3_URGENT', vitalSigns: '', initialAssessment: '',
                assignedDoctorId: '', treatmentArea: '', bedNumber: '', notes: '', ambulanceArrival: false
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCase(null);
    };

    const getTriageColor = (level) => {
        switch (level) {
            case 'LEVEL_1_RESUSCITATION': return '#dc2626';
            case 'LEVEL_2_EMERGENCY': return '#ea580c';
            case 'LEVEL_3_URGENT': return '#eab308';
            case 'LEVEL_4_LESS_URGENT': return '#22c55e';
            case 'LEVEL_5_NON_URGENT': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'WAITING': return 'status-pending';
            case 'TRIAGE': case 'IN_TREATMENT': return 'status-in-progress';
            case 'OBSERVATION': return 'status-review';
            case 'DISCHARGED': case 'ADMITTED': return 'status-completed';
            default: return '';
        }
    };

    const filteredCases = cases.filter(c =>
        c.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculation
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters]);

    const filterConfig = [
        { name: 'status', label: 'Status', type: 'select', options: statuses.map(s => ({ value: s, label: s.replace('_', ' ') })) },
        { name: 'triageLevel', label: 'Triage Level', type: 'select', options: triageLevels }
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="main-content">
                    <Header pageTitle="Emergency Department" />
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header pageTitle="Emergency Department" />

                <div className="page-toolbar">
                    <div className="search-filter">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input type="text" placeholder="Search cases..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <button className="filter-btn" onClick={() => setShowFilterModal(true)}><FiFilter /> Filter</button>
                    </div>
                    {(isAdmin() || isDoctor()) && (
                        <button className="add-btn" onClick={() => openModal()}><FiPlus /> New Case</button>
                    )}
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Triage</th>
                                <th>Patient</th>
                                <th>Chief Complaint</th>
                                <th>Arrival</th>
                                <th>Doctor</th>
                                <th>Area/Bed</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCases.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '24px', height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: getTriageColor(c.triageLevel),
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '24px',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}>
                                            {c.triageLevel?.charAt(6) || '?'}
                                        </span>
                                    </td>
                                    <td>{c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : c.patientName || 'Unknown'}</td>
                                    <td>{c.chiefComplaint}</td>
                                    <td>{c.arrivalTime ? new Date(c.arrivalTime).toLocaleTimeString() : '-'}</td>
                                    <td>{c.assignedDoctor ? `Dr. ${c.assignedDoctor.firstName}` : '-'}</td>
                                    <td>{c.treatmentArea || '-'} {c.bedNumber ? `/ ${c.bedNumber}` : ''}</td>
                                    <td><span className={`status-badge ${getStatusBadgeClass(c.status)}`}>{c.status?.replace('_', ' ')}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            {c.status === 'WAITING' && (
                                                <button className="action-btn view" onClick={() => handleStartTriage(c.id)} title="Start Triage"><FiAlertTriangle /></button>
                                            )}
                                            {c.status === 'TRIAGE' && (
                                                <button className="action-btn complete" onClick={() => handleStartTreatment(c.id)} title="Start Treatment"><FiPlay /></button>
                                            )}
                                            {(c.status === 'IN_TREATMENT' || c.status === 'OBSERVATION') && (
                                                <button className="action-btn complete" onClick={() => handleDischarge(c.id)} title="Discharge"><FiCheckCircle /></button>
                                            )}
                                            <button className="action-btn edit" onClick={() => openModal(c)}><FiEdit2 /></button>
                                            {isAdmin() && (
                                                <button className="action-btn delete" onClick={() => handleDelete(c.id)}><FiTrash2 /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {!loading && filteredCases.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredCases.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            totalItems={filteredCases.length}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                    {filteredCases.length === 0 && <div className="empty-state">No active emergency cases</div>}
                </div>

                {showFilterModal && <FilterModal filters={filterConfig} activeFilters={activeFilters} onApply={(f) => { setActiveFilters(f); setShowFilterModal(false); }} onClose={() => setShowFilterModal(false)} />}

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header"><h2>{editingCase ? 'Edit' : 'New'} Emergency Case</h2><button className="btn-close" onClick={closeModal}><FiX /></button></div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group full-width"><label><strong>Registered Patient (optional)</strong></label><select value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}><option value="">Select or enter details below</option>{patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></div>

                                    <div className="form-group"><label>Patient Name</label><input type="text" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} placeholder="For walk-in patients" /></div>
                                    <div className="form-group"><label>Age</label><input type="number" value={formData.patientAge} onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })} /></div>
                                    <div className="form-group"><label>Gender</label><select value={formData.patientGender} onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                                    <div className="form-group"><label>Phone</label><input type="text" value={formData.patientPhone} onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })} /></div>

                                    <div className="form-group full-width"><label>Chief Complaint *</label><input type="text" value={formData.chiefComplaint} onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })} required placeholder="Primary reason for visit" /></div>

                                    <div className="form-group"><label>Triage Level *</label><select value={formData.triageLevel} onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })} required style={{ borderLeft: `4px solid ${getTriageColor(formData.triageLevel)}` }}>{triageLevels.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                    <div className="form-group"><label>Assigned Doctor</label><select value={formData.assignedDoctorId} onChange={(e) => setFormData({ ...formData, assignedDoctorId: e.target.value })}><option value="">Select Doctor</option>{doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}</select></div>

                                    <div className="form-group"><label>Treatment Area</label><input type="text" value={formData.treatmentArea} onChange={(e) => setFormData({ ...formData, treatmentArea: e.target.value })} placeholder="e.g., Trauma Bay 1" /></div>
                                    <div className="form-group"><label>Bed Number</label><input type="text" value={formData.bedNumber} onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })} /></div>

                                    <div className="form-group full-width"><label>Vital Signs</label><input type="text" value={formData.vitalSigns} onChange={(e) => setFormData({ ...formData, vitalSigns: e.target.value })} placeholder="BP: 120/80, HR: 72, Temp: 98.6°F, SpO2: 98%" /></div>
                                    <div className="form-group full-width"><label>Initial Assessment</label><textarea value={formData.initialAssessment} onChange={(e) => setFormData({ ...formData, initialAssessment: e.target.value })} rows={2} /></div>
                                    <div className="form-group full-width"><label>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} /></div>

                                    <div className="form-group"><label><input type="checkbox" checked={formData.ambulanceArrival} onChange={(e) => setFormData({ ...formData, ambulanceArrival: e.target.checked })} /> Arrived by Ambulance</label></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn-primary">{editingCase ? 'Update' : 'Create'} Case</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Emergency;
