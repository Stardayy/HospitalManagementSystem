import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiSearch, FiEdit2, FiFilter, FiCheck, FiSend, FiDollarSign } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';
import '../styles/SortDropdown.css';

const Insurance = () => {
    const { isAdmin } = useAuth();
    const [claims, setClaims] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });
    const [editingClaim, setEditingClaim] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '', insuranceProvider: '', policyNumber: '', groupNumber: '',
        subscriberName: '', subscriberId: '', claimAmount: '', diagnosisCodes: '',
        procedureCodes: '', preAuthorizationNumber: '', notes: ''
    });

    const claimStatuses = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED', 'APPEALED', 'PAID', 'CLOSED'];

    useEffect(() => {
        fetchClaims();
        fetchPatients();
    }, []);

    const fetchClaims = async () => {
        try {
            const data = await api.get('/insurance');
            setClaims(data);
        } catch (error) {
            console.error('Error fetching claims:', error);
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
            const claimData = {
                patient: { id: parseInt(formData.patientId) },
                insuranceProvider: formData.insuranceProvider,
                policyNumber: formData.policyNumber,
                groupNumber: formData.groupNumber,
                subscriberName: formData.subscriberName,
                subscriberId: formData.subscriberId,
                claimAmount: formData.claimAmount ? parseFloat(formData.claimAmount) : null,
                diagnosisCodes: formData.diagnosisCodes,
                procedureCodes: formData.procedureCodes,
                preAuthorizationNumber: formData.preAuthorizationNumber,
                notes: formData.notes
            };

            if (editingClaim) {
                await api.put(`/insurance/${editingClaim.id}`, claimData);
            } else {
                await api.post('/insurance', claimData);
            }
            fetchClaims();
            closeModal();
        } catch (error) {
            console.error('Error saving claim:', error);
            alert('Failed to save claim');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this claim?')) {
            try {
                await api.delete(`/insurance/${id}`);
                fetchClaims();
            } catch (error) {
                console.error('Error deleting claim:', error);
            }
        }
    };

    const handleSubmitClaim = async (id) => {
        try {
            await api.put(`/insurance/${id}/submit`);
            fetchClaims();
        } catch (error) {
            console.error('Error submitting claim:', error);
        }
    };

    const handleApprove = async (id) => {
        const amount = prompt('Enter approved amount:');
        if (amount) {
            try {
                await api.put(`/insurance/${id}/approve?approvedAmount=${amount}`);
                fetchClaims();
            } catch (error) {
                console.error('Error approving claim:', error);
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/insurance/${id}/status?status=${status}`);
            fetchClaims();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const openModal = (claim = null) => {
        if (claim) {
            setEditingClaim(claim);
            setFormData({
                patientId: claim.patient?.id || '',
                insuranceProvider: claim.insuranceProvider || '',
                policyNumber: claim.policyNumber || '',
                groupNumber: claim.groupNumber || '',
                subscriberName: claim.subscriberName || '',
                subscriberId: claim.subscriberId || '',
                claimAmount: claim.claimAmount || '',
                diagnosisCodes: claim.diagnosisCodes || '',
                procedureCodes: claim.procedureCodes || '',
                preAuthorizationNumber: claim.preAuthorizationNumber || '',
                notes: claim.notes || ''
            });
        } else {
            setEditingClaim(null);
            setFormData({
                patientId: '', insuranceProvider: '', policyNumber: '', groupNumber: '',
                subscriberName: '', subscriberId: '', claimAmount: '', diagnosisCodes: '',
                procedureCodes: '', preAuthorizationNumber: '', notes: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClaim(null);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED': case 'PAID': return 'status-active';
            case 'SUBMITTED': case 'UNDER_REVIEW': return 'status-pending';
            case 'REJECTED': return 'status-cancelled';
            case 'DRAFT': return 'status-draft';
            default: return '';
        }
    };

    const filteredClaims = claims
        .filter(c =>
            c.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.insuranceProvider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.claimNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!currentSort.sortBy) return 0;
            let comparison = 0;
            switch (currentSort.sortBy) {
                case 'claimNumber':
                    comparison = (a.claimNumber || '').localeCompare(b.claimNumber || '');
                    break;
                case 'patient':
                    comparison = `${a.patient?.firstName} ${a.patient?.lastName}`.localeCompare(`${b.patient?.firstName} ${b.patient?.lastName}`);
                    break;
                case 'status':
                    comparison = (a.status || '').localeCompare(b.status || '');
                    break;
                case 'amount':
                    comparison = (a.claimAmount || 0) - (b.claimAmount || 0);
                    break;
                default:
                    return 0;
            }
            return currentSort.sortDirection === 'desc' ? -comparison : comparison;
        });

    // Pagination calculation
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters]);

    const filterConfig = [
        { key: 'status', label: 'Status', type: 'select', options: claimStatuses.map(s => ({ value: s, label: s.replace('_', ' ') })) }
    ];

    const sortOptions = [
        { value: 'claimNumber', label: 'Claim Number' },
        { value: 'patient', label: 'Patient Name' },
        { value: 'status', label: 'Status' },
        { value: 'amount', label: 'Amount' }
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="main-content">
                    <Header pageTitle="Insurance Claims" />
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header pageTitle="Insurance Claims" />

                <div className="page-toolbar">
                    <div className="search-filter">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input type="text" placeholder="Search claims..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <button className="filter-btn" onClick={() => setShowFilterModal(true)}><FiFilter /> Filter</button>
                        <SortDropdown
                            sortOptions={sortOptions}
                            currentSort={currentSort}
                            onSort={setCurrentSort}
                        />
                    </div>
                    {isAdmin() && (
                        <button className="add-btn" onClick={() => openModal()}><FiPlus /> New Claim</button>
                    )}
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Claim #</th>
                                <th>Patient</th>
                                <th>Provider</th>
                                <th>Policy #</th>
                                <th>Amount</th>
                                <th>Approved</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClaims.map(claim => (
                                <tr key={claim.id}>
                                    <td>{claim.claimNumber}</td>
                                    <td>{claim.patient?.firstName} {claim.patient?.lastName}</td>
                                    <td>{claim.insuranceProvider}</td>
                                    <td>{claim.policyNumber || '-'}</td>
                                    <td>${claim.claimAmount?.toFixed(2) || '0.00'}</td>
                                    <td>${claim.approvedAmount?.toFixed(2) || '-'}</td>
                                    <td><span className={`status-badge ${getStatusBadgeClass(claim.status)}`}>{claim.status?.replace('_', ' ')}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            {claim.status === 'DRAFT' && (
                                                <>
                                                    <button className="action-btn edit" onClick={() => openModal(claim)}><FiEdit2 /></button>
                                                    <button className="action-btn complete" onClick={() => handleSubmitClaim(claim.id)} title="Submit"><FiSend /></button>
                                                </>
                                            )}
                                            {(claim.status === 'SUBMITTED' || claim.status === 'UNDER_REVIEW') && isAdmin() && (
                                                <button className="action-btn complete" onClick={() => handleApprove(claim.id)} title="Approve"><FiCheck /></button>
                                            )}
                                            {isAdmin() && (
                                                <button className="action-btn delete" onClick={() => handleDelete(claim.id)}><FiTrash2 /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {!loading && filteredClaims.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredClaims.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            totalItems={filteredClaims.length}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                    {filteredClaims.length === 0 && <div className="empty-state">No claims found</div>}
                </div>

                <FilterModal
                    isOpen={showFilterModal}
                    filterConfig={filterConfig}
                    onApply={(f) => { setActiveFilters(f); setShowFilterModal(false); }}
                    onClose={() => setShowFilterModal(false)}
                    title="Filter Insurance Claims"
                />

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header"><h2>{editingClaim ? 'Edit' : 'New'} Insurance Claim</h2><button className="btn-close" onClick={closeModal}><FiX /></button></div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group"><label>Patient *</label><select value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required><option value="">Select Patient</option>{patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></div>
                                    <div className="form-group"><label>Insurance Provider *</label><input type="text" value={formData.insuranceProvider} onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })} required /></div>
                                    <div className="form-group"><label>Policy Number</label><input type="text" value={formData.policyNumber} onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })} /></div>
                                    <div className="form-group"><label>Group Number</label><input type="text" value={formData.groupNumber} onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })} /></div>
                                    <div className="form-group"><label>Subscriber Name</label><input type="text" value={formData.subscriberName} onChange={(e) => setFormData({ ...formData, subscriberName: e.target.value })} /></div>
                                    <div className="form-group"><label>Subscriber ID</label><input type="text" value={formData.subscriberId} onChange={(e) => setFormData({ ...formData, subscriberId: e.target.value })} /></div>
                                    <div className="form-group"><label>Claim Amount</label><input type="number" step="0.01" value={formData.claimAmount} onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })} /></div>
                                    <div className="form-group"><label>Pre-Auth Number</label><input type="text" value={formData.preAuthorizationNumber} onChange={(e) => setFormData({ ...formData, preAuthorizationNumber: e.target.value })} /></div>
                                    <div className="form-group"><label>Diagnosis Codes</label><input type="text" value={formData.diagnosisCodes} onChange={(e) => setFormData({ ...formData, diagnosisCodes: e.target.value })} placeholder="e.g., J18.9, R05" /></div>
                                    <div className="form-group"><label>Procedure Codes</label><input type="text" value={formData.procedureCodes} onChange={(e) => setFormData({ ...formData, procedureCodes: e.target.value })} placeholder="e.g., 99213, 71046" /></div>
                                    <div className="form-group full-width"><label>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} /></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn-primary">{editingClaim ? 'Update' : 'Create'}</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insurance;
