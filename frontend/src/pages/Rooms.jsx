import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiHome, FiCheckCircle, FiXCircle, FiTool } from 'react-icons/fi';
import Layout from '../component/Layout';
import api from '../api/api';
import '../styles/Pages.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
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
    
    const matchesStatus = 
      filterStatus === 'all' ||
      room.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1><FiHome /> Room Management</h1>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Rooms</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
            <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FiPlus /> Add Room
            </button>
          </div>
        </div>

        {/* Room Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <span className="stat-value">{rooms.length}</span>
          </div>
          <div className="stat-card stat-success">
            <h3>Available</h3>
            <span className="stat-value">{availableCount}</span>
          </div>
          <div className="stat-card stat-warning">
            <h3>Occupied</h3>
            <span className="stat-value">{occupiedCount}</span>
          </div>
          <div className="stat-card stat-info">
            <h3>Total Beds</h3>
            <span className="stat-value">{totalBeds}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="cards-grid">
            {filteredRooms.length === 0 ? (
              <div className="no-data-card">No rooms found</div>
            ) : (
              filteredRooms.map(room => (
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
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
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
                <div className="modal-actions">
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
        )}
      </div>
    </Layout>
  );
};

export default Rooms;
