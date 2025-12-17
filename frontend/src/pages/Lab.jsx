import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheckCircle, FiClock, FiAlertCircle, FiDownload, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import FilterModal from '../component/FilterModal';
import SortDropdown from '../component/SortDropdown';
import { useAuth } from '../context/AuthContext';
import '../styles/Pages.css';
import '../styles/FilterModal.css';
import '../styles/SortDropdown.css';

const Lab = () => {
  const { isAdmin, isDoctor, isPatient } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [labOrders, setLabOrders] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentSort, setCurrentSort] = useState({ sortBy: '', sortDirection: 'asc' });

  const [orderFormData, setOrderFormData] = useState({
    patientId: '',
    doctorId: '',
    priority: 'NORMAL',
    notes: '',
    testIds: []
  });

  const [testFormData, setTestFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    normalRange: '',
    sampleType: '',
    turnaroundTime: '',
    isActive: true
  });

  const [resultFormData, setResultFormData] = useState({
    labTestId: '',
    resultValue: '',
    unit: '',
    referenceRange: '',
    resultStatus: 'NORMAL',
    notes: ''
  });

  useEffect(() => {
    fetchLabOrders();
    fetchLabTests();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchLabOrders = async () => {
    try {
      const data = await api.get('/lab/orders');
      setLabOrders(data);
    } catch (error) {
      console.error('Error fetching lab orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabTests = async () => {
    try {
      const data = await api.get('/lab/tests');
      setLabTests(data);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
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

  // Lab Order handlers
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        priority: orderFormData.priority,
        notes: orderFormData.notes
      };
      
      const testIdsParam = orderFormData.testIds.join(',');
      
      if (editingOrder) {
        await api.put(`/lab/orders/${editingOrder.id}`, payload);
      } else {
        await api.post(`/lab/orders?patientId=${orderFormData.patientId}&doctorId=${orderFormData.doctorId}&testIds=${testIdsParam}`, payload);
      }
      fetchLabOrders();
      closeModal();
    } catch (error) {
      console.error('Error saving lab order:', error);
      alert(error.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab order?')) {
      try {
        await api.delete(`/lab/orders/${id}`);
        fetchLabOrders();
      } catch (error) {
        console.error('Error deleting lab order:', error);
      }
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/lab/orders/${orderId}/status?status=${status}`, {});
      fetchLabOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Lab Test handlers
  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await api.put(`/lab/tests/${editingTest.id}`, testFormData);
      } else {
        await api.post('/lab/tests', testFormData);
      }
      fetchLabTests();
      closeTestModal();
    } catch (error) {
      console.error('Error saving lab test:', error);
      alert(error.message);
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      try {
        await api.delete(`/lab/tests/${id}`);
        fetchLabTests();
      } catch (error) {
        console.error('Error deleting lab test:', error);
      }
    }
  };

  // Result handlers
  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/lab/results?labOrderId=${selectedOrder.id}&labTestId=${resultFormData.labTestId}`, resultFormData);
      fetchLabOrders();
      closeResultModal();
    } catch (error) {
      console.error('Error saving result:', error);
      alert(error.message);
    }
  };

  const downloadLabReport = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/reports/lab/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lab_report_${orderId}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Modal controls
  const openModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setOrderFormData({
        patientId: order.patient?.id || '',
        doctorId: order.doctor?.id || '',
        priority: order.priority || 'NORMAL',
        notes: order.notes || '',
        testIds: order.results?.map(r => r.labTest?.id) || []
      });
    } else {
      setEditingOrder(null);
      setOrderFormData({
        patientId: '',
        doctorId: '',
        priority: 'NORMAL',
        notes: '',
        testIds: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  const openTestModal = (test = null) => {
    if (test) {
      setEditingTest(test);
      setTestFormData({
        name: test.name || '',
        description: test.description || '',
        category: test.category || '',
        price: test.price || '',
        normalRange: test.normalRange || '',
        sampleType: test.sampleType || '',
        turnaroundTime: test.turnaroundTime || '',
        isActive: test.isActive !== false
      });
    } else {
      setEditingTest(null);
      setTestFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        normalRange: '',
        sampleType: '',
        turnaroundTime: '',
        isActive: true
      });
    }
    setShowTestModal(true);
  };

  const closeTestModal = () => {
    setShowTestModal(false);
    setEditingTest(null);
  };

  const openResultModal = (order) => {
    setSelectedOrder(order);
    setResultFormData({
      labTestId: '',
      resultValue: '',
      unit: '',
      referenceRange: '',
      resultStatus: 'NORMAL',
      notes: ''
    });
    setShowResultModal(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setSelectedOrder(null);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'COMPLETED': return 'status-completed';
      case 'IN_PROGRESS': return 'status-confirmed';
      case 'SAMPLE_COLLECTED': return 'status-scheduled';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const getResultStatusClass = (status) => {
    switch(status) {
      case 'NORMAL': return 'status-completed';
      case 'ABNORMAL_LOW': 
      case 'ABNORMAL_HIGH': return 'status-scheduled';
      case 'CRITICAL': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'URGENT': return 'priority-urgent';
      case 'STAT': return 'priority-stat';
      default: return 'priority-normal';
    }
  };

  // Filter and sort
  const filteredOrders = labOrders
    .filter(order => {
      const matchesSearch = 
        order.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !activeFilters.status || order.status === activeFilters.status;
      const matchesPriority = !activeFilters.priority || order.priority === activeFilters.priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (!currentSort.sortBy) return 0;
      let comparison = 0;
      switch(currentSort.sortBy) {
        case 'date':
          comparison = new Date(a.orderDate) - new Date(b.orderDate);
          break;
        case 'patient':
          comparison = (a.patient?.lastName || '').localeCompare(b.patient?.lastName || '');
          break;
        default:
          return 0;
      }
      return currentSort.sortDirection === 'desc' ? -comparison : comparison;
    });

  const filteredTests = labTests.filter(test =>
    test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterConfig = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'SAMPLE_COLLECTED', label: 'Sample Collected' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ]
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'NORMAL', label: 'Normal' },
        { value: 'URGENT', label: 'Urgent' },
        { value: 'STAT', label: 'STAT' }
      ]
    }
  ];

  const sortOptions = [
    { value: 'date', label: 'Order Date' },
    { value: 'patient', label: 'Patient Name' }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header title="Lab Management" />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header title="Lab Management" />

        {/* Tab Navigation */}
        <div className="page-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Lab Orders
          </button>
          {(isAdmin() || isDoctor()) && (
            <button 
              className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              Lab Tests Catalog
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="page-toolbar">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? "Search orders..." : "Search tests..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'orders' && (
              <>
                <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
                  <FiFilter /> Filter
                </button>
                <SortDropdown
                  options={sortOptions}
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />
              </>
            )}
          </div>
          {(isAdmin() || isDoctor()) && (
            <button className="add-btn" onClick={() => activeTab === 'orders' ? openModal() : openTestModal()}>
              <FiPlus /> {activeTab === 'orders' ? 'New Order' : 'New Test'}
            </button>
          )}
        </div>

        {/* Lab Orders Tab */}
        {activeTab === 'orders' && (
          <div className="page-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Order Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>LAB-{String(order.id).padStart(4, '0')}</td>
                    <td>{order.patient?.firstName} {order.patient?.lastName}</td>
                    <td>Dr. {order.doctor?.firstName} {order.doctor?.lastName}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(order.priority)}`}>
                        {order.priority || 'NORMAL'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {(isAdmin() || isDoctor()) && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button 
                            className="action-btn add-result" 
                            onClick={() => openResultModal(order)}
                            title="Add Result"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        {order.status === 'COMPLETED' && (
                          <button 
                            className="action-btn download" 
                            onClick={() => downloadLabReport(order.id)}
                            title="Download Report"
                          >
                            <FiDownload />
                          </button>
                        )}
                        {(isAdmin() || isDoctor()) && (
                          <>
                            <button className="action-btn edit" onClick={() => openModal(order)}>
                              <FiEdit2 />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteOrder(order.id)}>
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
            {filteredOrders.length === 0 && (
              <div className="empty-state">No lab orders found</div>
            )}
          </div>
        )}

        {/* Lab Tests Catalog Tab */}
        {activeTab === 'tests' && (isAdmin() || isDoctor()) && (
          <div className="page-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Sample Type</th>
                  <th>Price</th>
                  <th>Normal Range</th>
                  <th>Turnaround</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map(test => (
                  <tr key={test.id}>
                    <td>{test.name}</td>
                    <td>{test.category}</td>
                    <td>{test.sampleType}</td>
                    <td>${test.price?.toFixed(2)}</td>
                    <td>{test.normalRange}</td>
                    <td>{test.turnaroundTime}</td>
                    <td>
                      <span className={`status-badge ${test.isActive ? 'status-completed' : 'status-cancelled'}`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => openTestModal(test)}>
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteTest(test.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTests.length === 0 && (
              <div className="empty-state">No lab tests found</div>
            )}
          </div>
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

        {/* New/Edit Lab Order Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingOrder ? 'Edit Lab Order' : 'New Lab Order'}</h2>
                <button className="close-btn" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleOrderSubmit}>
                <div className="form-grid">
                  {!editingOrder && (
                    <>
                      <div className="form-group">
                        <label>Patient *</label>
                        <select
                          value={orderFormData.patientId}
                          onChange={(e) => setOrderFormData({...orderFormData, patientId: e.target.value})}
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
                      <div className="form-group">
                        <label>Ordering Doctor *</label>
                        <select
                          value={orderFormData.doctorId}
                          onChange={(e) => setOrderFormData({...orderFormData, doctorId: e.target.value})}
                          required
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={orderFormData.priority}
                      onChange={(e) => setOrderFormData({...orderFormData, priority: e.target.value})}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="URGENT">Urgent</option>
                      <option value="STAT">STAT</option>
                    </select>
                  </div>
                  {!editingOrder && (
                    <div className="form-group full-width">
                      <label>Tests *</label>
                      <div className="test-checkboxes">
                        {labTests.filter(t => t.isActive).map(test => (
                          <label key={test.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={orderFormData.testIds.includes(test.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setOrderFormData({...orderFormData, testIds: [...orderFormData.testIds, test.id]});
                                } else {
                                  setOrderFormData({...orderFormData, testIds: orderFormData.testIds.filter(id => id !== test.id)});
                                }
                              }}
                            />
                            {test.name} (${test.price?.toFixed(2)})
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={orderFormData.notes}
                      onChange={(e) => setOrderFormData({...orderFormData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="submit-btn">
                    {editingOrder ? 'Update' : 'Create Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New/Edit Lab Test Modal */}
        {showTestModal && (
          <div className="modal-overlay" onClick={closeTestModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingTest ? 'Edit Lab Test' : 'New Lab Test'}</h2>
                <button className="close-btn" onClick={closeTestModal}><FiX /></button>
              </div>
              <form onSubmit={handleTestSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Test Name *</label>
                    <input
                      type="text"
                      value={testFormData.name}
                      onChange={(e) => setTestFormData({...testFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={testFormData.category}
                      onChange={(e) => setTestFormData({...testFormData, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="HEMATOLOGY">Hematology</option>
                      <option value="BIOCHEMISTRY">Biochemistry</option>
                      <option value="MICROBIOLOGY">Microbiology</option>
                      <option value="IMMUNOLOGY">Immunology</option>
                      <option value="URINALYSIS">Urinalysis</option>
                      <option value="PATHOLOGY">Pathology</option>
                      <option value="RADIOLOGY">Radiology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sample Type *</label>
                    <select
                      value={testFormData.sampleType}
                      onChange={(e) => setTestFormData({...testFormData, sampleType: e.target.value})}
                      required
                    >
                      <option value="">Select Sample Type</option>
                      <option value="BLOOD">Blood</option>
                      <option value="URINE">Urine</option>
                      <option value="STOOL">Stool</option>
                      <option value="SALIVA">Saliva</option>
                      <option value="TISSUE">Tissue</option>
                      <option value="CSF">CSF</option>
                      <option value="SWAB">Swab</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={testFormData.price}
                      onChange={(e) => setTestFormData({...testFormData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Normal Range</label>
                    <input
                      type="text"
                      value={testFormData.normalRange}
                      onChange={(e) => setTestFormData({...testFormData, normalRange: e.target.value})}
                      placeholder="e.g., 4.5-11.0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Turnaround Time</label>
                    <input
                      type="text"
                      value={testFormData.turnaroundTime}
                      onChange={(e) => setTestFormData({...testFormData, turnaroundTime: e.target.value})}
                      placeholder="e.g., 24 hours"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={testFormData.description}
                      onChange={(e) => setTestFormData({...testFormData, description: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={testFormData.isActive}
                        onChange={(e) => setTestFormData({...testFormData, isActive: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeTestModal}>Cancel</button>
                  <button type="submit" className="submit-btn">
                    {editingTest ? 'Update' : 'Create Test'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Result Modal */}
        {showResultModal && selectedOrder && (
          <div className="modal-overlay" onClick={closeResultModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Test Result</h2>
                <button className="close-btn" onClick={closeResultModal}><FiX /></button>
              </div>
              <form onSubmit={handleResultSubmit}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Test *</label>
                    <select
                      value={resultFormData.labTestId}
                      onChange={(e) => {
                        const test = labTests.find(t => t.id === parseInt(e.target.value));
                        setResultFormData({
                          ...resultFormData, 
                          labTestId: e.target.value,
                          referenceRange: test?.normalRange || ''
                        });
                      }}
                      required
                    >
                      <option value="">Select Test</option>
                      {labTests.map(test => (
                        <option key={test.id} value={test.id}>{test.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Result Value *</label>
                    <input
                      type="text"
                      value={resultFormData.resultValue}
                      onChange={(e) => setResultFormData({...resultFormData, resultValue: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      value={resultFormData.unit}
                      onChange={(e) => setResultFormData({...resultFormData, unit: e.target.value})}
                      placeholder="e.g., mg/dL"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reference Range</label>
                    <input
                      type="text"
                      value={resultFormData.referenceRange}
                      onChange={(e) => setResultFormData({...resultFormData, referenceRange: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Result Status *</label>
                    <select
                      value={resultFormData.resultStatus}
                      onChange={(e) => setResultFormData({...resultFormData, resultStatus: e.target.value})}
                      required
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="ABNORMAL_LOW">Abnormal Low</option>
                      <option value="ABNORMAL_HIGH">Abnormal High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={resultFormData.notes}
                      onChange={(e) => setResultFormData({...resultFormData, notes: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeResultModal}>Cancel</button>
                  <button type="submit" className="submit-btn">Save Result</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lab;
