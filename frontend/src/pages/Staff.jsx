import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiSearch, FiEdit2, FiFilter, FiClock, FiCheck, FiUserCheck } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';

const Staff = () => {
    const { isAdmin } = useAuth();
    const [staff, setStaff] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('staff');
    const [showModal, setShowModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [editingStaff, setEditingStaff] = useState(null);
    const [editingShift, setEditingShift] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', role: 'NURSE',
        departmentId: '', status: 'ACTIVE', address: '', qualifications: ''
    });

    const [shiftFormData, setShiftFormData] = useState({
        staffId: '', shiftDate: '', shiftType: 'MORNING', departmentId: '', notes: ''
    });

    const staffRoles = ['NURSE', 'HEAD_NURSE', 'TECHNICIAN', 'LAB_TECHNICIAN', 'PHARMACIST', 'RECEPTIONIST', 'ADMIN_STAFF', 'MAINTENANCE', 'SECURITY'];
    const shiftTypes = ['MORNING', 'AFTERNOON', 'NIGHT'];
    const shiftStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'ABSENT', 'ON_LEAVE', 'CANCELLED'];

    useEffect(() => {
        fetchStaff();
        fetchShifts();
        fetchDepartments();
    }, []);

    const fetchStaff = async () => {
        try {
            const data = await api.get('/staff');
            setStaff(data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShifts = async () => {
        try {
            const data = await api.get('/staff/shifts');
            setShifts(data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
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
            const staffData = {
                ...formData,
                department: formData.departmentId ? { id: parseInt(formData.departmentId) } : null
            };
            delete staffData.departmentId;

            if (editingStaff) {
                await api.put(`/staff/${editingStaff.id}`, staffData);
            } else {
                await api.post('/staff', staffData);
            }
            fetchStaff();
            closeModal();
        } catch (error) {
            console.error('Error saving staff:', error);
            alert('Failed to save staff member');
        }
    };

    const handleShiftSubmit = async (e) => {
        e.preventDefault();
        try {
            const shiftData = {
                staff: { id: parseInt(shiftFormData.staffId) },
                shiftDate: shiftFormData.shiftDate,
                shiftType: shiftFormData.shiftType,
                department: shiftFormData.departmentId ? { id: parseInt(shiftFormData.departmentId) } : null,
                notes: shiftFormData.notes
            };

            if (editingShift) {
                await api.put(`/staff/shifts/${editingShift.id}`, shiftData);
            } else {
                await api.post('/staff/shifts', shiftData);
            }
            fetchShifts();
            closeShiftModal();
        } catch (error) {
            console.error('Error saving shift:', error);
            alert('Failed to save shift');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/staff/${id}`);
                fetchStaff();
            } catch (error) {
                console.error('Error deleting staff:', error);
            }
        }
    };

    const handleDeleteShift = async (id) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            try {
                await api.delete(`/staff/shifts/${id}`);
                fetchShifts();
            } catch (error) {
                console.error('Error deleting shift:', error);
            }
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await api.put(`/staff/shifts/${id}/check-in`);
            fetchShifts();
        } catch (error) {
            console.error('Error checking in:', error);
        }
    };

    const handleCheckOut = async (id) => {
        try {
            await api.put(`/staff/shifts/${id}/check-out`);
            fetchShifts();
        } catch (error) {
            console.error('Error checking out:', error);
        }
    };

    const openModal = (staffMember = null) => {
        if (staffMember) {
            setEditingStaff(staffMember);
            setFormData({
                firstName: staffMember.firstName || '',
                lastName: staffMember.lastName || '',
                email: staffMember.email || '',
                phone: staffMember.phone || '',
                role: staffMember.role || 'NURSE',
                departmentId: staffMember.department?.id || '',
                status: staffMember.status || 'ACTIVE',
                address: staffMember.address || '',
                qualifications: staffMember.qualifications || ''
            });
        } else {
            setEditingStaff(null);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '', role: 'NURSE',
                departmentId: '', status: 'ACTIVE', address: '', qualifications: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStaff(null);
    };

    const openShiftModal = (shift = null) => {
        if (shift) {
            setEditingShift(shift);
            setShiftFormData({
                staffId: shift.staff?.id || '',
                shiftDate: shift.shiftDate || '',
                shiftType: shift.shiftType || 'MORNING',
                departmentId: shift.department?.id || '',
                notes: shift.notes || ''
            });
        } else {
            setEditingShift(null);
            setShiftFormData({
                staffId: '', shiftDate: new Date().toISOString().split('T')[0],
                shiftType: 'MORNING', departmentId: '', notes: ''
            });
        }
        setShowShiftModal(true);
    };

    const closeShiftModal = () => {
        setShowShiftModal(false);
        setEditingShift(null);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ACTIVE': case 'COMPLETED': return 'status-active';
            case 'ON_LEAVE': case 'SCHEDULED': return 'status-pending';
            case 'INACTIVE': case 'ABSENT': case 'CANCELLED': return 'status-cancelled';
            case 'IN_PROGRESS': return 'status-in-progress';
            default: return '';
        }
    };

    const getShiftTimeLabel = (type) => {
        switch (type) {
            case 'MORNING': return '6:00 AM - 2:00 PM';
            case 'AFTERNOON': return '2:00 PM - 10:00 PM';
            case 'NIGHT': return '10:00 PM - 6:00 AM';
            default: return type;
        }
    };

    const filteredStaff = staff.filter(s =>
        s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredShifts = shifts.filter(s =>
        s.staff?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.staff?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculation
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Choose which list to paginate based on activeTab
    const currentList = activeTab === 'staff' ? filteredStaff : filteredShifts;
    const paginatedList = currentList.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when filters or tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters, activeTab]);

    const filterConfig = [
        { name: 'role', label: 'Role', type: 'select', options: staffRoles.map(r => ({ value: r, label: r.replace('_', ' ') })) }
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <Sidebar />
                <div className="main-content">
                    <Header pageTitle="Staff Management" />
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header pageTitle="Staff Management" />

                <div className="page-tabs">
                    <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Staff List</button>
                    <button className={activeTab === 'shifts' ? 'active' : ''} onClick={() => setActiveTab('shifts')}>Shift Schedule</button>
                </div>

                <div className="page-toolbar">
                    <div className="search-filter">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <button className="filter-btn" onClick={() => setShowFilterModal(true)}><FiFilter /> Filter</button>
                    </div>
                    {isAdmin() && (
                        <button className="add-btn" onClick={() => activeTab === 'staff' ? openModal() : openShiftModal()}>
                            <FiPlus /> {activeTab === 'staff' ? 'Add Staff' : 'Add Shift'}
                        </button>
                    )}
                </div>

                <div className="table-container">
                    {activeTab === 'staff' ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.firstName} {s.lastName}</td>
                                        <td>{s.role?.replace('_', ' ')}</td>
                                        <td>{s.department?.name || '-'}</td>
                                        <td>{s.email || '-'}</td>
                                        <td>{s.phone || '-'}</td>
                                        <td><span className={`status-badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                {isAdmin() && (
                                                    <>
                                                        <button className="action-btn edit" onClick={() => openModal(s)}><FiEdit2 /></button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(s.id)}><FiTrash2 /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Staff</th>
                                    <th>Date</th>
                                    <th>Shift</th>
                                    <th>Time</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.staff?.firstName} {s.staff?.lastName}</td>
                                        <td>{s.shiftDate}</td>
                                        <td>{s.shiftType}</td>
                                        <td>{getShiftTimeLabel(s.shiftType)}</td>
                                        <td>{s.department?.name || '-'}</td>
                                        <td><span className={`status-badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                {s.status === 'SCHEDULED' && (
                                                    <button className="action-btn complete" onClick={() => handleCheckIn(s.id)} title="Check In"><FiClock /></button>
                                                )}
                                                {s.status === 'IN_PROGRESS' && (
                                                    <button className="action-btn complete" onClick={() => handleCheckOut(s.id)} title="Check Out"><FiCheck /></button>
                                                )}
                                                {isAdmin() && (
                                                    <>
                                                        <button className="action-btn edit" onClick={() => openShiftModal(s)}><FiEdit2 /></button>
                                                        <button className="action-btn delete" onClick={() => handleDeleteShift(s.id)}><FiTrash2 /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!loading && currentList.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(currentList.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        totalItems={currentList.length}
                        itemsPerPage={itemsPerPage}
                    />
                )}

                {showFilterModal && <FilterModal filters={filterConfig} activeFilters={activeFilters} onApply={(f) => { setActiveFilters(f); setShowFilterModal(false); }} onClose={() => setShowFilterModal(false)} />}

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header"><h2>{editingStaff ? 'Edit' : 'Add'} Staff</h2><button className="btn-close" onClick={closeModal}><FiX /></button></div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group"><label>First Name *</label><input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required /></div>
                                    <div className="form-group"><label>Last Name *</label><input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required /></div>
                                    <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                                    <div className="form-group"><label>Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                                    <div className="form-group"><label>Role *</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>{staffRoles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}</select></div>
                                    <div className="form-group"><label>Department</label><select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}><option value="">Select Department</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                                    <div className="form-group"><label>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option value="ACTIVE">Active</option><option value="ON_LEAVE">On Leave</option><option value="INACTIVE">Inactive</option></select></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn-primary">{editingStaff ? 'Update' : 'Add'}</button></div>
                            </form>
                        </div>
                    </div>
                )}

                {showShiftModal && (
                    <div className="modal-overlay" onClick={closeShiftModal}>
                        <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header"><h2>{editingShift ? 'Edit' : 'Add'} Shift</h2><button className="btn-close" onClick={closeShiftModal}><FiX /></button></div>
                            <form onSubmit={handleShiftSubmit}>
                                <div className="form-grid">
                                    <div className="form-group"><label>Staff *</label><select value={shiftFormData.staffId} onChange={(e) => setShiftFormData({ ...shiftFormData, staffId: e.target.value })} required><option value="">Select Staff</option>{staff.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}</select></div>
                                    <div className="form-group"><label>Date *</label><input type="date" value={shiftFormData.shiftDate} onChange={(e) => setShiftFormData({ ...shiftFormData, shiftDate: e.target.value })} required /></div>
                                    <div className="form-group"><label>Shift Type *</label><select value={shiftFormData.shiftType} onChange={(e) => setShiftFormData({ ...shiftFormData, shiftType: e.target.value })} required>{shiftTypes.map(t => <option key={t} value={t}>{t} ({getShiftTimeLabel(t)})</option>)}</select></div>
                                    <div className="form-group"><label>Department</label><select value={shiftFormData.departmentId} onChange={(e) => setShiftFormData({ ...shiftFormData, departmentId: e.target.value })}><option value="">Select Department</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                                    <div className="form-group full-width"><label>Notes</label><textarea value={shiftFormData.notes} onChange={(e) => setShiftFormData({ ...shiftFormData, notes: e.target.value })} rows={2} /></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn-secondary" onClick={closeShiftModal}>Cancel</button><button type="submit" className="btn-primary">{editingShift ? 'Update' : 'Add'}</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;
