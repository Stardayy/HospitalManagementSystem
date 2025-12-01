import React, { useState, useEffect } from 'react';
import { FiX, FiFilter, FiRefreshCw } from 'react-icons/fi';
import '../styles/FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApply, filterConfig, title = 'Filter' }) => {
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    if (filterConfig) {
      const initialValues = {};
      filterConfig.forEach(filter => {
        initialValues[filter.key] = filter.type === 'checkbox' ? false : '';
      });
      setFilterValues(initialValues);
    }
  }, [filterConfig, isOpen]);

  const handleChange = (key, value) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApply(filterValues);
  };

  const handleReset = () => {
    const resetValues = {};
    filterConfig.forEach(filter => {
      resetValues[filter.key] = filter.type === 'checkbox' ? false : '';
    });
    setFilterValues(resetValues);
    onApply({});
  };

  if (!isOpen || !filterConfig) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <div className="filter-modal-title">
            <FiFilter />
            <h3>{title}</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="filter-modal-body">
          <div className="filter-grid">
            {filterConfig.map((filter) => (
              <div key={filter.key} className={`filter-group ${filter.type === 'checkbox' ? 'filter-checkbox' : ''}`}>
                {filter.type === 'checkbox' ? (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filterValues[filter.key] || false}
                      onChange={(e) => handleChange(filter.key, e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">{filter.label}</span>
                  </label>
                ) : (
                  <>
                    <label>{filter.label}</label>
                    {filter.type === 'select' ? (
                      <select
                        value={filterValues[filter.key] || ''}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : filter.type === 'date' ? (
                      <input
                        type="date"
                        value={filterValues[filter.key] || ''}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        value={filterValues[filter.key] || ''}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                        placeholder={`Enter ${filter.label.toLowerCase()}`}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="filter-modal-footer">
          <button className="btn-reset" onClick={handleReset}>
            <FiRefreshCw /> Reset All
          </button>
          <button className="btn-apply" onClick={handleApply}>
            <FiFilter /> Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
