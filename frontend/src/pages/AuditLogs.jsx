import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiX, FiShield, FiActivity, FiUser, FiCalendar, FiGlobe, FiInfo } from 'react-icons/fi';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import Pagination from '../component/Pagination';
import api from '../api/api';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchLogs();
    }, [currentPage, searchTerm, currentSort]); // Added currentSort to dependencies

    const fetchLogs = async () => {
        try {
            setLoading(true);
            // Backend pagination is 0-indexed
            const sortParam = currentSort.sortBy ? `&sortBy=${currentSort.sortBy}&sortDirection=${currentSort.sortDirection}` : '';
            const response = await api.get(`/audit-logs?page=${currentPage - 1}&size=${itemsPerPage}&search=${searchTerm}${sortParam}`);

            const debugData = response.data || response; // Handle potential axios wrapper differences
            setLogs(debugData.content || []);
            setTotalPages(debugData.totalPages || 0);
            setTotalItems(debugData.totalElements || 0);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            toast.error('Failed to load audit logs.');
            setLogs([]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const getActionColor = (action) => {
        const act = (action || '').toUpperCase();
        if (act.includes('DELETE')) return 'status-cancelled'; // Red
        if (act.includes('CREATE')) return 'status-confirmed'; // Green
        if (act.includes('UPDATE')) return 'status-rescheduled'; // Blue/Orange
        if (act.includes('LOGIN')) return 'status-completed'; // Teal
        return '';
    };

    // Filter configuration
    const filterConfig = [
        {
            key: 'action',
            label: 'Action',
            type: 'select',
            options: [
                { value: 'CREATE', label: 'Create' },
                { value: 'UPDATE', label: 'Update' },
                { value: 'DELETE', label: 'Delete' },
                { value: 'LOGIN', label: 'Login' },
                { value: 'LOGOUT', label: 'Logout' }
            ]
        },
        {
            key: 'role',
            label: 'User Role',
            type: 'select',
            options: [
                { value: 'ADMIN', label: 'Admin' },
                { value: 'DOCTOR', label: 'Doctor' },
                { value: 'NURSE', label: 'Nurse' },
                { value: 'PATIENT', label: 'Patient' },
                { value: 'PHARMACIST', label: 'Pharmacist' }
            ]
        }
    ];

    // Apply filters to logs
    const filteredLogs = logs.filter(log => {
        const matchesAction = !activeFilters.action || (log.action && log.action.includes(activeFilters.action));
        const matchesRole = !activeFilters.role || (log.userRole === activeFilters.role);
        return matchesAction && matchesRole;
    });

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== undefined).length;

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setShowFilterModal(false);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveFilters({});
        setCurrentPage(1);
    };

    const sortOptions = [
        { value: 'timestamp', label: 'Timestamp' },
        { value: 'username', label: 'User' }, // Changed from 'user' to 'username' to match backend field
        { value: 'action', label: 'Action' }
    ];

    // Sorting is now handled by the backend via fetchLogs, so this client-side sort is no longer strictly needed for `logs`
    // but `filteredLogs` might still benefit if filters are applied client-side.
    // However, since `fetchLogs` is triggered by `currentSort`, `logs` will already be sorted.
    // We can simplify this by just using `filteredLogs` directly if `fetchLogs` handles sorting.
    // For now, keeping `sortedLogs` but it will effectively be `filteredLogs` if backend sorts.
    const sortedLogs = [...filteredLogs]; // If backend sorts, this is already sorted.

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Header pageTitle="Audit Logs & Security" />

                <div className="page-toolbar">
                    <div className="search-filter">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search logs (User, Action, Entity)..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset to page 1 on search
                                }}
                            />
                        </div>
                        <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
                            <FiFilter /> Filter
                            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                        </button>
                        <SortDropdown
                            sortOptions={sortOptions}
                            currentSort={currentSort}
                            onSort={setCurrentSort}
                        />
                        {activeFilterCount > 0 && (
                            <button className="btn-clear-filter" onClick={clearFilters}>
                                <FiX /> Clear Filters
                            </button>
                        )}
                    </div>
                    <div className="toolbar-stats" style={{ marginLeft: 'auto', display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiShield size={16} /> <span>Secure Logging Active</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading logs...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Entity</th>
                                    <th>Details</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-data">
                                            <div className="no-data-content">
                                                <FiActivity size={48} />
                                                <p>No audit logs found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                                                {formatDate(log.timestamp)}
                                            </td>
                                            <td>
                                                {log.username || 'System'}
                                                <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>
                                                    (#{log.userId})
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 500 }}>{log.entityName}</span>
                                                {log.entityId !== 'N/A' && <span style={{ color: '#94a3b8', fontSize: '12px' }}> #{log.entityId}</span>}
                                            </td>
                                            <td className="details-cell" title={log.details}>
                                                <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <FiInfo size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
                                                    {log.details || 'No details'}
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#64748b' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <FiGlobe size={14} />
                                                    {log.ipAddress || 'Unknown'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Filter Modal */}
                <FilterModal
                    isOpen={showFilterModal}
                    filterConfig={filterConfig}
                    onApply={handleApplyFilters}
                    onClose={() => setShowFilterModal(false)}
                    title="Filter Audit Logs"
                />
            </div>
        </div>
    );
};

export default AuditLogs;
