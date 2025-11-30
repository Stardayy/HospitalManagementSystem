import React, { useState, useEffect } from 'react';
import { FiSearch, FiSettings, FiBell, FiPlus, FiEdit2, FiTrash2, FiX, FiDollarSign, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import '../styles/Pages.css';

const Payments = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formData, setFormData] = useState({
    patientId: '',
    billDate: '',
    consultationFee: '',
    medicineCost: '',
    roomCharges: '',
    labCharges: '',
    otherCharges: '',
    discount: '',
    tax: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  const fetchBills = async () => {
    try {
      const data = await api.get('/bills');
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
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
      const billData = {
        billDate: formData.billDate,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : 0,
        medicineCost: formData.medicineCost ? parseFloat(formData.medicineCost) : 0,
        roomCharges: formData.roomCharges ? parseFloat(formData.roomCharges) : 0,
        labCharges: formData.labCharges ? parseFloat(formData.labCharges) : 0,
        otherCharges: formData.otherCharges ? parseFloat(formData.otherCharges) : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        tax: formData.tax ? parseFloat(formData.tax) : 0,
        notes: formData.notes
      };

      if (editingBill) {
        await api.put(`/bills/${editingBill.id}`, billData);
      } else {
        await api.post(`/bills?patientId=${formData.patientId}`, billData);
      }
      fetchBills();
      closeModal();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await api.put(`/bills/${selectedBill.id}/pay?paymentMethod=${paymentMethod}`, {});
      fetchBills();
      setShowPayModal(false);
      setSelectedBill(null);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const openModal = (bill = null) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        patientId: bill.patient?.id || '',
        billDate: bill.billDate || '',
        consultationFee: bill.consultationFee || '',
        medicineCost: bill.medicineCost || '',
        roomCharges: bill.roomCharges || '',
        labCharges: bill.labCharges || '',
        otherCharges: bill.otherCharges || '',
        discount: bill.discount || '',
        tax: bill.tax || '',
        notes: bill.notes || ''
      });
    } else {
      setEditingBill(null);
      setFormData({
        patientId: '',
        billDate: new Date().toISOString().split('T')[0],
        consultationFee: '',
        medicineCost: '',
        roomCharges: '',
        labCharges: '',
        otherCharges: '',
        discount: '',
        tax: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBill(null);
  };

  const openPayModal = (bill) => {
    setSelectedBill(bill);
    setPaymentMethod('CASH');
    setShowPayModal(true);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'PAID': return 'status-completed';
      case 'PENDING': return 'status-scheduled';
      case 'PARTIAL': return 'status-confirmed';
      case 'CANCELLED': return 'status-cancelled';
      case 'REFUNDED': return 'status-no-show';
      default: return '';
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || bill.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bills.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + (b.netAmount || 0), 0);
  const pendingAmount = bills.filter(b => b.paymentStatus === 'PENDING').reduce((sum, b) => sum + (b.netAmount || 0), 0);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search bills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-tools">
            <FiSettings />
            <FiBell />
            <div className="user-profile">
              <img src="https://via.placeholder.com/30" alt="User" />
              <span>Alfredo Westervelt</span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <h1>Payments</h1>
          <button className="btn-primary" onClick={() => openModal()}>
            <FiPlus /> Create Bill
          </button>
        </div>

        <div className="stats-summary payment-stats">
          <div className="stat-item revenue">
            <FiDollarSign size={24} />
            <div>
              <span className="stat-number">${totalRevenue.toFixed(2)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
          <div className="stat-item pending">
            <FiCreditCard size={24} />
            <div>
              <span className="stat-number">${pendingAmount.toFixed(2)}</span>
              <span className="stat-label">Pending Amount</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-number">{bills.length}</span>
            <span className="stat-label">Total Bills</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{bills.filter(b => b.paymentStatus === 'PAID').length}</span>
            <span className="stat-label">Paid Bills</span>
          </div>
        </div>

        <div className="filter-bar">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Patient</th>
                  <th>Bill Date</th>
                  <th>Consultation</th>
                  <th>Medicine</th>
                  <th>Room</th>
                  <th>Lab</th>
                  <th>Other</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Net Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Payment Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.id}</td>
                    <td>{bill.patient?.firstName} {bill.patient?.lastName}</td>
                    <td>{bill.billDate}</td>
                    <td>${bill.consultationFee?.toFixed(2) || '0.00'}</td>
                    <td>${bill.medicineCost?.toFixed(2) || '0.00'}</td>
                    <td>${bill.roomCharges?.toFixed(2) || '0.00'}</td>
                    <td>${bill.labCharges?.toFixed(2) || '0.00'}</td>
                    <td>${bill.otherCharges?.toFixed(2) || '0.00'}</td>
                    <td>${bill.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td>${bill.discount?.toFixed(2) || '0.00'}</td>
                    <td>${bill.tax?.toFixed(2) || '0.00'}</td>
                    <td className="amount-cell">${bill.netAmount?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(bill.paymentStatus)}`}>
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td>{bill.paymentMethod || '-'}</td>
                    <td>{bill.paymentDate || '-'}</td>
                    <td>{bill.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        {bill.paymentStatus === 'PENDING' && (
                          <button 
                            className="btn-icon btn-success" 
                            onClick={() => openPayModal(bill)}
                            title="Process Payment"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        <button className="btn-icon btn-edit" onClick={() => openModal(bill)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(bill.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBills.length === 0 && (
              <div className="no-data">No bills found</div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingBill ? 'Edit Bill' : 'Create Bill'}</h2>
                <button className="btn-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient *</label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      required
                      disabled={editingBill}
                    >
                      <option value="">Select Patient</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bill Date *</label>
                    <input
                      type="date"
                      value={formData.billDate}
                      onChange={(e) => setFormData({...formData, billDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Consultation Fee</label>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Medicine Cost</label>
                    <input
                      type="number"
                      value={formData.medicineCost}
                      onChange={(e) => setFormData({...formData, medicineCost: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Charges</label>
                    <input
                      type="number"
                      value={formData.roomCharges}
                      onChange={(e) => setFormData({...formData, roomCharges: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lab Charges</label>
                    <input
                      type="number"
                      value={formData.labCharges}
                      onChange={(e) => setFormData({...formData, labCharges: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Other Charges</label>
                    <input
                      type="number"
                      value={formData.otherCharges}
                      onChange={(e) => setFormData({...formData, otherCharges: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax</label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) => setFormData({...formData, tax: e.target.value})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows="2"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingBill ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPayModal && (
          <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Process Payment</h2>
                <button className="btn-close" onClick={() => setShowPayModal(false)}><FiX /></button>
              </div>
              <div className="payment-details">
                <div className="payment-info">
                  <span>Patient:</span>
                  <strong>{selectedBill?.patient?.firstName} {selectedBill?.patient?.lastName}</strong>
                </div>
                <div className="payment-info">
                  <span>Amount Due:</span>
                  <strong className="amount">${selectedBill?.netAmount?.toFixed(2)}</strong>
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPayModal(false)}>Cancel</button>
                <button type="button" className="btn-primary" onClick={handlePayment}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;
