import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiSearch, FiEdit2, FiEye, FiCheck, FiFilter } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';

const Prescriptions = () => {
    const { isAdmin, isDoctor, isPatient, isPharmacist } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [editingPrescription, setEditingPrescription] = useState(null);
    const [viewingPrescription, setViewingPrescription] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        diagnosis: '',
        notes: '',
        items: [{ medicineName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
    });

    useEffect(() => {
        fetchPrescriptions();
        if (!isPatient()) {
            fetchPatients();
            fetchMedicines();
        }
        if (isAdmin() || isPharmacist()) {
            fetchDoctors();
        }
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const data = await api.get('/prescriptions');
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
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

    const fetchMedicines = async () => {
        try {
            const data = await api.get('/medicines');
            setMedicines(data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const prescriptionData = {
                patient: { id: parseInt(formData.patientId) },
                doctor: formData.doctorId ? { id: parseInt(formData.doctorId) } : undefined,
                diagnosis: formData.diagnosis,
                notes: formData.notes,
                items: formData.items.filter(item => item.medicineName).map(item => ({
                    medicineName: item.medicineName,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    quantity: item.quantity ? parseInt(item.quantity) : null,
                    instructions: item.instructions
                }))
            };

            if (editingPrescription) {
                await api.put(`/prescriptions/${editingPrescription.id}`, prescriptionData);
            } else {
                await api.post('/prescriptions', prescriptionData);
            }

            fetchPrescriptions();
            closeModal();
        } catch (error) {
            console.error('Error saving prescription:', error);
            alert('Failed to save prescription');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            try {
                await api.delete(`/prescriptions/${id}`);
                fetchPrescriptions();
            } catch (error) {
                console.error('Error deleting prescription:', error);
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/prescriptions/${id}/status?status=${status}`);
            fetchPrescriptions();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const openModal = (prescription = null) => {
        if (prescription) {
            setEditingPrescription(prescription);
            setFormData({
                patientId: prescription.patient?.id || '',
                doctorId: prescription.doctor?.id || '',
                diagnosis: prescription.diagnosis || '',
                notes: prescription.notes || '',
                items: prescription.items?.length > 0 ? prescription.items.map(item => ({
                    medicineName: item.medicineName || '',
                    dosage: item.dosage || '',
                    frequency: item.frequency || '',
                    duration: item.duration || '',
                    quantity: item.quantity || '',
                    instructions: item.instructions || ''
                })) : [{ medicineName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
            });
        } else {
            setEditingPrescription(null);
            setFormData({
                patientId: '',
                doctorId: '',
                diagnosis: '',
                notes: '',
                items: [{ medicineName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPrescription(null);
        setFormData({
            patientId: '',
            doctorId: '',
            diagnosis: '',
            notes: '',
            items: [{ medicineName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
        });
    };

    const viewPrescription = async (prescription) => {
        try {
            const details = await api.get(`/prescriptions/${prescription.id}/details`);
            setViewingPrescription(details);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching prescription details:', error);
        }
    };

    const addMedicineItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { medicineName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' }]
        });
    };

    const removeMedicineItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateMedicineItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-active';
            case 'DISPENSED': return 'status-completed';
            case 'PARTIALLY_DISPENSED': return 'status-pending';
            case 'CANCELLED': return 'status-cancelled';
            case 'EXPIRED': return 'status-expired';
            default: return '';
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesSearch =
            p.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !activeFilters.status || p.status === activeFilters.status;

        return matchesSearch && matchesStatus;
    });

    // Pagination calculation
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedPrescriptions = filteredPrescriptions.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters]);

    const filterConfig = [
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'ACTIVE', label: 'Active' },
                { value: 'DISPENSED', label: 'Dispensed' },
                { value: 'PARTIALLY_DISPENSED', label: 'Partially Dispensed' },
                { value: 'CANCELLED', label: 'Cancelled' },
                { value: 'EXPIRED', label: 'Expired' }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="main-content">
                    <Header pageTitle="Prescriptions" />
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header pageTitle="Prescriptions" />

                <div className="page-toolbar">
                    <div className="search-filter">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search prescriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
                            <FiFilter /> Filter
                        </button>
                    </div>
                    {(isAdmin() || isDoctor()) && (
                        <button className="add-btn" onClick={() => openModal()}>
                            <FiPlus /> New Prescription
                        </button>
                    )}
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Diagnosis</th>
                                <th>Date</th>
                                <th>Expiry</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPrescriptions.map(prescription => (
                                <tr key={prescription.id}>
                                    <td>#{prescription.id}</td>
                                    <td>{prescription.patient?.firstName} {prescription.patient?.lastName}</td>
                                    <td>Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}</td>
                                    <td>{prescription.diagnosis || '-'}</td>
                                    <td>{prescription.prescriptionDate}</td>
                                    <td>{prescription.expiryDate}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(prescription.status)}`}>
                                            {prescription.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn view" onClick={() => viewPrescription(prescription)} title="View">
                                                <FiEye />
                                            </button>
                                            {(isAdmin() || isDoctor() || isPharmacist()) && prescription.status === 'ACTIVE' && (
                                                <>
                                                    {(isAdmin() || isDoctor()) && (
                                                        <button className="action-btn edit" onClick={() => openModal(prescription)} title="Edit">
                                                            <FiEdit2 />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="action-btn complete"
                                                        onClick={() => handleStatusChange(prescription.id, 'DISPENSED')}
                                                        title="Mark Dispensed"
                                                    >
                                                        <FiCheck />
                                                    </button>
                                                </>
                                            )}
                                            {isAdmin() && (
                                                <button className="action-btn delete" onClick={() => handleDelete(prescription.id)} title="Delete">
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {!loading && filteredPrescriptions.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredPrescriptions.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        totalItems={filteredPrescriptions.length}
                        itemsPerPage={itemsPerPage}
                    />
                )}
                {filteredPrescriptions.length === 0 && (
                    <div className="empty-state">No prescriptions found</div>
                )}

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

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</h2>
                                <button className="btn-close" onClick={closeModal}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
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
                                    {isAdmin() && (
                                        <div className="form-group">
                                            <label>Doctor</label>
                                            <select
                                                value={formData.doctorId}
                                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doctor => (
                                                    <option key={doctor.id} value={doctor.id}>
                                                        Dr. {doctor.firstName} {doctor.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group full-width">
                                        <label>Diagnosis</label>
                                        <input
                                            type="text"
                                            value={formData.diagnosis}
                                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                            placeholder="Enter diagnosis"
                                        />
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Medicines</h3>
                                    <button type="button" className="add-item-btn" onClick={addMedicineItem}>
                                        <FiPlus /> Add Medicine
                                    </button>
                                </div>

                                {formData.items.map((item, index) => (
                                    <div key={index} className="medicine-row">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Medicine Name *</label>
                                                <input
                                                    type="text"
                                                    value={item.medicineName}
                                                    onChange={(e) => updateMedicineItem(index, 'medicineName', e.target.value)}
                                                    placeholder="Medicine name"
                                                    list={`medicines-${index}`}
                                                />
                                                <datalist id={`medicines-${index}`}>
                                                    {medicines.map(m => (
                                                        <option key={m.id} value={m.name} />
                                                    ))}
                                                </datalist>
                                            </div>
                                            <div className="form-group">
                                                <label>Dosage</label>
                                                <input
                                                    type="text"
                                                    value={item.dosage}
                                                    onChange={(e) => updateMedicineItem(index, 'dosage', e.target.value)}
                                                    placeholder="e.g., 500mg"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Frequency</label>
                                                <select
                                                    value={item.frequency}
                                                    onChange={(e) => updateMedicineItem(index, 'frequency', e.target.value)}
                                                >
                                                    <option value="">Select frequency</option>
                                                    <option value="Once daily">Once daily</option>
                                                    <option value="Twice daily">Twice daily</option>
                                                    <option value="Three times daily">Three times daily</option>
                                                    <option value="Four times daily">Four times daily</option>
                                                    <option value="Every 4 hours">Every 4 hours</option>
                                                    <option value="Every 6 hours">Every 6 hours</option>
                                                    <option value="Every 8 hours">Every 8 hours</option>
                                                    <option value="As needed">As needed</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Duration</label>
                                                <input
                                                    type="text"
                                                    value={item.duration}
                                                    onChange={(e) => updateMedicineItem(index, 'duration', e.target.value)}
                                                    placeholder="e.g., 7 days"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Quantity</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateMedicineItem(index, 'quantity', e.target.value)}
                                                    placeholder="Qty"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Instructions</label>
                                                <input
                                                    type="text"
                                                    value={item.instructions}
                                                    onChange={(e) => updateMedicineItem(index, 'instructions', e.target.value)}
                                                    placeholder="e.g., Take after meals"
                                                />
                                            </div>
                                        </div>
                                        {formData.items.length > 1 && (
                                            <button type="button" className="remove-item-btn" onClick={() => removeMedicineItem(index)}>
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="form-group full-width">
                                    <label>Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={2}
                                        placeholder="Additional notes..."
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                                    <button type="submit" className="btn-primary">
                                        {editingPrescription ? 'Update' : 'Create'} Prescription
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && viewingPrescription && (
                    <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Prescription Details</h2>
                                <button className="btn-close" onClick={() => setShowViewModal(false)}><FiX /></button>
                            </div>
                            <div className="prescription-details">
                                <div className="detail-row">
                                    <strong>Patient:</strong> {viewingPrescription.patient?.firstName} {viewingPrescription.patient?.lastName}
                                </div>
                                <div className="detail-row">
                                    <strong>Doctor:</strong> Dr. {viewingPrescription.doctor?.firstName} {viewingPrescription.doctor?.lastName}
                                </div>
                                <div className="detail-row">
                                    <strong>Diagnosis:</strong> {viewingPrescription.diagnosis || '-'}
                                </div>
                                <div className="detail-row">
                                    <strong>Date:</strong> {viewingPrescription.prescriptionDate}
                                </div>
                                <div className="detail-row">
                                    <strong>Expiry:</strong> {viewingPrescription.expiryDate}
                                </div>
                                <div className="detail-row">
                                    <strong>Status:</strong>
                                    <span className={`status-badge ${getStatusBadgeClass(viewingPrescription.status)}`}>
                                        {viewingPrescription.status}
                                    </span>
                                </div>

                                <h3>Prescribed Medicines</h3>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Medicine</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                            <th>Qty</th>
                                            <th>Instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewingPrescription.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.medicineName}</td>
                                                <td>{item.dosage || '-'}</td>
                                                <td>{item.frequency || '-'}</td>
                                                <td>{item.duration || '-'}</td>
                                                <td>{item.quantity || '-'}</td>
                                                <td>{item.instructions || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {viewingPrescription.notes && (
                                    <div className="detail-row">
                                        <strong>Notes:</strong> {viewingPrescription.notes}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescriptions;
