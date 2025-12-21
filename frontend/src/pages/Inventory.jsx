import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiPackage, FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../api/api';
import Pagination from '../component/Pagination';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/DropdownFix.css';
import '../styles/SortDropdown.css';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    description: '',
    dosageForm: '',
    strength: '',
    price: '',
    stockQuantity: '',
    expiryDate: '',
    reorderLevel: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await api.get('/medicines');
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const medicineData = {
        name: formData.name,
        genericName: formData.genericName,
        manufacturer: formData.manufacturer,
        description: formData.description,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        price: formData.price ? parseFloat(formData.price) : 0,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
        expiryDate: formData.expiryDate,
        reorderLevel: formData.reorderLevel ? parseInt(formData.reorderLevel) : 10
      };

      if (editingMedicine) {
        await api.put(`/medicines/${editingMedicine.id}`, medicineData);
      } else {
        await api.post('/medicines', medicineData);
      }
      fetchMedicines();
      closeModal();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await api.delete(`/medicines/${id}`);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleStockUpdate = async (id, quantity) => {
    try {
      await api.put(`/medicines/${id}/stock?quantity=${quantity}`, {});
      fetchMedicines();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const openModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name || '',
        genericName: medicine.genericName || '',
        manufacturer: medicine.manufacturer || '',
        description: medicine.description || '',
        dosageForm: medicine.dosageForm || '',
        strength: medicine.strength || '',
        price: medicine.price || '',
        stockQuantity: medicine.stockQuantity || '',
        expiryDate: medicine.expiryDate || '',
        reorderLevel: medicine.reorderLevel || ''
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        name: '',
        genericName: '',
        manufacturer: '',
        description: '',
        dosageForm: '',
        strength: '',
        price: '',
        stockQuantity: '',
        expiryDate: '',
        reorderLevel: '10'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
  };

  const isLowStock = (medicine) => {
    return medicine.stockQuantity <= (medicine.reorderLevel || 10);
  };

  const isExpiringSoon = (medicine) => {
    if (!medicine.expiryDate) return false;
    const expiry = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (medicine) => {
    if (!medicine.expiryDate) return false;
    return new Date(medicine.expiryDate) < new Date();
  };

  // Get unique dosage forms for filter
  const dosageForms = [...new Set(medicines.map(m => m.dosageForm).filter(Boolean))];

  const fetchFilteredMedicines = async (filters, sort = currentSort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.dosageForm) params.append('dosageForm', filters.dosageForm);
      if (filters.lowStock) params.append('lowStock', 'true');
      if (filters.expired) params.append('expired', 'true');
      if (filters.expiringSoon) params.append('expiringSoon', 'true');
      if (sort.sortBy) params.append('sortBy', sort.sortBy);
      if (sort.sortDirection) params.append('sortDirection', sort.sortDirection);

      const data = await api.get(`/medicines/filter?${params.toString()}`);
      setMedicines(data);
      setActiveFilters(filters);
    } catch (error) {
      console.error('Error filtering medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    const hasFilters = Object.values(filters).some(v => v !== '' && v !== false);
    if (hasFilters) {
      fetchFilteredMedicines(filters);
    } else {
      fetchMedicines();
      setActiveFilters({});
    }
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
    if (currentSort.sortBy) {
      fetchFilteredMedicines({}, currentSort);
    } else {
      fetchMedicines();
    }
  };

  const handleSort = (sort) => {
    setCurrentSort(sort);
    if (sort.sortBy || Object.keys(activeFilters).length > 0) {
      fetchFilteredMedicines(activeFilters, sort);
    } else {
      fetchMedicines();
    }
  };

  const filterConfig = [
    {
      key: 'dosageForm',
      label: 'Dosage Form',
      type: 'select',
      options: [
        { value: 'Tablet', label: 'Tablet' },
        { value: 'Capsule', label: 'Capsule' },
        { value: 'Syrup', label: 'Syrup' },
        { value: 'Injection', label: 'Injection' },
        { value: 'Cream', label: 'Cream' },
        { value: 'Ointment', label: 'Ointment' },
        { value: 'Drops', label: 'Drops' }
      ]
    },
    {
      key: 'lowStock',
      label: 'Low Stock Only',
      type: 'checkbox'
    },
    {
      key: 'expired',
      label: 'Expired Only',
      type: 'checkbox'
    },
    {
      key: 'expiringSoon',
      label: 'Expiring Soon (30 days)',
      type: 'checkbox'
    }
  ];

  const sortOptions = [
    { value: 'name', label: 'Medicine Name' },
    { value: 'genericName', label: 'Generic Name' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'price', label: 'Price' },
    { value: 'stockQuantity', label: 'Stock Quantity' },
    { value: 'expiryDate', label: 'Expiry Date' },
    { value: 'id', label: 'ID' }
  ];

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== false && v !== undefined).length;

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch =
      medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination calculation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, currentSort]);

  const lowStockCount = medicines.filter(isLowStock).length;
  const expiringCount = medicines.filter(isExpiringSoon).length;
  const expiredCount = medicines.filter(isExpired).length;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <Header pageTitle="Inventory" />

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FiPackage size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{medicines.length}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
          <div className="stat-card" onClick={() => setFilterType('LOW_STOCK')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon warning">
              <FiAlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{lowStockCount}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="stat-card" onClick={() => setFilterType('EXPIRING')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon warning">
              <FiCalendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{expiringCount}</span>
              <span className="stat-label">Expiring Soon</span>
            </div>
          </div>
          <div className="stat-card" onClick={() => setFilterType('EXPIRED')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon danger">
              <FiAlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{expiredCount}</span>
              <span className="stat-label">Expired</span>
            </div>
          </div>
        </div>

        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search medicines..."
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
          <button className="add-btn" onClick={() => openModal()}>
            <FiPlus /> Add Medicine
          </button>
        </div>

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          title="Filter Inventory"
        />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine Name</th>
                  <th>Generic Name</th>
                  <th>Manufacturer</th>
                  <th>Description</th>
                  <th>Dosage Form</th>
                  <th>Strength</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMedicines.map((medicine) => (
                  <tr key={medicine.id} className={isExpired(medicine) ? 'row-expired' : ''}>
                    <td>{medicine.id}</td>
                    <td>{medicine.name}</td>
                    <td>{medicine.genericName || '-'}</td>
                    <td>{medicine.manufacturer || '-'}</td>
                    <td>{medicine.description || '-'}</td>
                    <td>{medicine.dosageForm || '-'}</td>
                    <td>{medicine.strength || '-'}</td>
                    <td>${medicine.price?.toFixed(2) || '0.00'}</td>
                    <td>
                      <div className="stock-cell">
                        <span className={isLowStock(medicine) ? 'low-stock' : ''}>
                          {medicine.stockQuantity}
                        </span>
                        {isLowStock(medicine) && (
                          <FiAlertTriangle className="warning-icon" size={14} />
                        )}
                      </div>
                    </td>
                    <td>{medicine.reorderLevel || '-'}</td>
                    <td>
                      <span className={isExpired(medicine) ? 'expired-date' : isExpiringSoon(medicine) ? 'expiring-date' : ''}>
                        {medicine.expiryDate || '-'}
                      </span>
                    </td>
                    <td>
                      {isExpired(medicine) ? (
                        <span className="status-badge status-cancelled">Expired</span>
                      ) : isLowStock(medicine) ? (
                        <span className="status-badge status-scheduled">Low Stock</span>
                      ) : isExpiringSoon(medicine) ? (
                        <span className="status-badge status-confirmed">Expiring Soon</span>
                      ) : (
                        <span className="status-badge status-completed">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" onClick={() => openModal(medicine)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(medicine.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedMedicines.length === 0 && (
              <div className="no-data">No medicines found matching your search.</div>
            )}
          </div>
        )}

        {/* Pagination */
          !loading && filteredMedicines.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredMedicines.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredMedicines.length}
              itemsPerPage={itemsPerPage}
            />
          )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Medicine Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Generic Name</label>
                    <input
                      type="text"
                      value={formData.genericName}
                      onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Manufacturer</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dosage Form</label>
                    <select
                      value={formData.dosageForm}
                      onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    >
                      <option value="">Select Form</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Drops">Drops</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Strength</label>
                    <input
                      type="text"
                      value={formData.strength}
                      onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                      placeholder="e.g., 500mg, 10ml"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Reorder Level</label>
                    <input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingMedicine ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;
