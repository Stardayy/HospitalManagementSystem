import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiHome, FiCheckCircle, FiXCircle, FiTool, FiFilter, FiSearch } from 'react-icons/fi';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import api from '../api/api';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';
import Pagination from '../component/Pagination';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({});
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'GENERAL',
    departmentId: '',
    floorNumber: 1,
    bedCount: 1,
    dailyRate: '',
    status: 'AVAILABLE',
    facilities: ''
  });

  const roomTypes = ['GENERAL', 'PRIVATE', 'ICU', 'EMERGENCY', 'OPERATION', 'RECOVERY'];
  const roomStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, departmentsData] = await Promise.all([
        api.get('/rooms'),
        api.get('/departments')
      ]);
      setRooms(roomsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        floorNumber: parseInt(formData.floorNumber),
        bedCount: parseInt(formData.bedCount),
        dailyRate: parseFloat(formData.dailyRate),
        status: formData.status,
        facilities: formData.facilities
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, payload);
        toast.success('Room updated successfully');
      } else {
        const url = formData.departmentId
          ? `/rooms?departmentId=${formData.departmentId}`
          : '/rooms';
        await api.post(url, payload);
        toast.success('Room created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(error.message || 'Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber || '',
      roomType: room.roomType || 'GENERAL',
      departmentId: room.department?.id || '',
      floorNumber: room.floorNumber || 1,
      bedCount: room.bedCount || 1,
      dailyRate: room.dailyRate || '',
      status: room.status || 'AVAILABLE',
      facilities: room.facilities || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/rooms/${id}`);
        toast.success('Room deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
      }
    }
  };

  const toggleStatus = async (room) => {
    try {
      const newStatus = room.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
      await api.patch(`/rooms/${room.id}/status?status=${newStatus}`);
      toast.success(`Room marked as ${newStatus.toLowerCase()}`);
      fetchData();
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Failed to update room status');
    }
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomType: 'GENERAL',
      departmentId: '',
      floorNumber: 1,
      bedCount: 1,
      dailyRate: '',
      status: 'AVAILABLE',
      facilities: ''
    });
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply active filters
    const matchesStatus = !activeFilters.status || room.status === activeFilters.status;
    const matchesType = !activeFilters.roomType || room.roomType === activeFilters.roomType;
    const matchesDepartment = !activeFilters.departmentId || room.department?.id?.toString() === activeFilters.departmentId;

    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  // Sort the filtered rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (!currentSort.sortBy) return 0;

    let aValue, bValue;
    switch (currentSort.sortBy) {
      case 'roomNumber':
        aValue = a.roomNumber?.toLowerCase() || '';
        bValue = b.roomNumber?.toLowerCase() || '';
        break;
      case 'roomType':
        aValue = a.roomType?.toLowerCase() || '';
        bValue = b.roomType?.toLowerCase() || '';
        break;
      case 'department':
        aValue = a.department?.name?.toLowerCase() || '';
        bValue = b.department?.name?.toLowerCase() || '';
        break;
      case 'bedCount':
        aValue = a.bedCount || 0;
        bValue = b.bedCount || 0;
        break;
      case 'dailyRate':
        aValue = a.dailyRate || 0;
        bValue = b.dailyRate || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return currentSort.sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return currentSort.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRooms = sortedRooms.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, currentSort]);

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: roomStatuses.map(s => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))
    },
    {
      key: 'roomType',
      label: 'Room Type',
      type: 'select',
      options: roomTypes.map(t => ({ value: t, label: t }))
    },
    {
      key: 'departmentId',
      label: 'Department',
      type: 'select',
      options: departments.map(d => ({ value: d.id.toString(), label: d.name }))
    }
  ];

  const sortOptions = [
    { value: 'roomNumber', label: 'Room Number' },
    { value: 'roomType', label: 'Room Type' },
    { value: 'department', label: 'Department' },
    { value: 'bedCount', label: 'Bed Count' },
    { value: 'dailyRate', label: 'Daily Rate' }
  ];

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'AVAILABLE': { icon: <FiCheckCircle />, className: 'status-active', label: 'Available' },
      'OCCUPIED': { icon: <FiXCircle />, className: 'status-inactive', label: 'Occupied' },
      'MAINTENANCE': { icon: <FiTool />, className: 'status-warning', label: 'Maintenance' },
      'RESERVED': { icon: <FiHome />, className: 'status-info', label: 'Reserved' }
    };
    const config = statusConfig[status] || statusConfig['AVAILABLE'];
    return (
      <span className={`status-badge ${config.className}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getRoomTypeBadge = (type) => {
    const colors = {
      'GENERAL': '#4A90A4',
      'PRIVATE': '#7B68EE',
      'ICU': '#DC143C',
      'OPERATION': '#FF8C00',
      'EMERGENCY': '#FF4500',
      'RECOVERY': '#20B2AA'
    };
    return (
      <span className="type-badge" style={{ backgroundColor: colors[type] || '#6c757d' }}>
        {type}
      </span>
    );
  };

  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedCount = rooms.filter(r => r.status === 'OCCUPIED').length;
  const totalBeds = rooms.reduce((sum, r) => sum + (r.bedCount || 0), 0);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <Header pageTitle="Room Management" />

        {/* Room Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon primary"><FiHome /></div>
            <div className="stat-info">
              <span className="stat-value">{rooms.length}</span>
              <span className="stat-label">Total Rooms</span>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon primary"><FiCheckCircle /></div>
            <div className="stat-info">
              <span className="stat-value">{availableCount}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon warning"><FiXCircle /></div>
            <div className="stat-info">
              <span className="stat-value">{occupiedCount}</span>
              <span className="stat-label">Occupied</span>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon secondary"><FiTool /></div>
            <div className="stat-info">
              <span className="stat-value">{totalBeds}</span>
              <span className="stat-label">Total Beds</span>
            </div>
          </div>
        </div>

        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search rooms..."
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
            <FiPlus /> Add Room
          </button>
        </div>

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          title="Filter Rooms"
        />

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="cards-grid">
            {paginatedRooms.length === 0 ? (
              <div className="no-data-card">No rooms found</div>
            ) : (
              paginatedRooms.map(room => (
                <div key={room.id} className={`room-card ${room.status !== 'AVAILABLE' ? 'occupied' : ''}`}>
                  <div className="room-card-header">
                    <h3>Room {room.roomNumber}</h3>
                    {getStatusBadge(room.status)}
                  </div>
                  <div className="room-card-body">
                    <div className="room-info">
                      {getRoomTypeBadge(room.roomType)}
                      <span className="room-department">{room.department?.name || 'Unassigned'}</span>
                    </div>
                    <div className="room-details">
                      <div className="detail">
                        <span className="label">Floor:</span>
                        <span className="value">{room.floorNumber || 'N/A'}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Beds:</span>
                        <span className="value">{room.bedCount || 0}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Daily Rate:</span>
                        <span className="value">${room.dailyRate?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    {room.facilities && (
                      <p className="room-description">{room.facilities}</p>
                    )}
                  </div>
                  <div className="room-card-actions">
                    <button
                      className={`btn-toggle ${room.status === 'AVAILABLE' ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => toggleStatus(room)}
                    >
                      {room.status === 'AVAILABLE' ? 'Mark Occupied' : 'Mark Available'}
                    </button>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(room)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(room.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
            }
          </div>
        )
        }

        {/* Pagination */
          !loading && sortedRooms.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedRooms.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={sortedRooms.length}
              itemsPerPage={itemsPerPage}
            />
          )
        }

        {/* Add/Edit Modal */}
        {
          showModal && (
            <div className="modal-overlay">
              <div className="modal modal-large">
                <div className="modal-header">
                  <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
                  <button className="btn-close" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Room Number *</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., 101"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Room Type *</label>
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleInputChange}
                        required
                      >
                        {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Floor Number</label>
                      <input
                        type="number"
                        name="floorNumber"
                        value={formData.floorNumber}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bed Count *</label>
                      <input
                        type="number"
                        name="bedCount"
                        value={formData.bedCount}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Daily Rate ($) *</label>
                      <input
                        type="number"
                        name="dailyRate"
                        value={formData.dailyRate}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        {roomStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Facilities</label>
                      <textarea
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleInputChange}
                        placeholder="Room facilities and amenities..."
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingRoom ? 'Update Room' : 'Create Room'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </main >
    </div >
  );
};

export default Rooms;
