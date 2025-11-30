import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import '../styles/CustomSelect.css';

const CustomSelect = ({ options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? 'open' : ''}`} ref={selectRef}>
      <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className={selectedOption ? 'selected-value' : 'placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown className="select-arrow" />
      </div>
      
      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              <span>{option.label}</span>
              {value === option.value && <FiCheck className="check-icon" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
