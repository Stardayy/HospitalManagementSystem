import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiArrowUp, FiArrowDown, FiCheck } from 'react-icons/fi';
import { TbArrowsSort } from 'react-icons/tb';
import '../styles/SortDropdown.css';

const SortDropdown = ({ sortOptions, onSort, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState(currentSort?.sortBy || '');
  const [sortDirection, setSortDirection] = useState(currentSort?.sortDirection || 'asc');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentSort) {
      setSortBy(currentSort.sortBy || '');
      setSortDirection(currentSort.sortDirection || 'asc');
    }
  }, [currentSort]);

  const handleSortSelect = (value) => {
    const newSortBy = value;
    setSortBy(newSortBy);
    if (newSortBy) {
      onSort({ sortBy: newSortBy, sortDirection });
    } else {
      onSort({ sortBy: '', sortDirection: 'asc' });
    }
  };

  const handleDirectionChange = (direction) => {
    setSortDirection(direction);
    if (sortBy) {
      onSort({ sortBy, sortDirection: direction });
    }
  };

  const clearSort = () => {
    setSortBy('');
    setSortDirection('asc');
    onSort({ sortBy: '', sortDirection: 'asc' });
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    if (!sortBy) return null;
    const option = sortOptions?.find(opt => opt.value === sortBy);
    return option?.label || sortBy;
  };

  const isActive = sortBy !== '';

  return (
    <div className="sort-dropdown-container" ref={dropdownRef}>
      <button 
        className={`btn-sort ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TbArrowsSort />
        <span>Sort</span>
        {isActive && (
          <span className="sort-indicator">
            {sortDirection === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          </span>
        )}
        <FiChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu">
          <div className="sort-dropdown-header">
            <span>Sort by</span>
            {isActive && (
              <button className="btn-clear-sort" onClick={clearSort}>
                Clear
              </button>
            )}
          </div>

          <div className="sort-options-list">
            <div 
              className={`sort-option ${sortBy === '' ? 'selected' : ''}`}
              onClick={() => handleSortSelect('')}
            >
              <span>Default Order</span>
              {sortBy === '' && <FiCheck className="check-icon" />}
            </div>
            {sortOptions?.map((option) => (
              <div 
                key={option.value}
                className={`sort-option ${sortBy === option.value ? 'selected' : ''}`}
                onClick={() => handleSortSelect(option.value)}
              >
                <span>{option.label}</span>
                {sortBy === option.value && <FiCheck className="check-icon" />}
              </div>
            ))}
          </div>

          {sortBy && (
            <div className="sort-direction-section">
              <div className="direction-label">Direction</div>
              <div className="direction-buttons">
                <button
                  className={`direction-btn ${sortDirection === 'asc' ? 'active' : ''}`}
                  onClick={() => handleDirectionChange('asc')}
                >
                  <FiArrowUp /> Ascending
                </button>
                <button
                  className={`direction-btn ${sortDirection === 'desc' ? 'active' : ''}`}
                  onClick={() => handleDirectionChange('desc')}
                >
                  <FiArrowDown /> Descending
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
