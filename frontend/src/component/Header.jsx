import React from 'react';
import { FiSearch, FiSettings, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header = ({ searchTerm, setSearchTerm, placeholder = "Search...", hideSearch = false, pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="top-bar">
      {pageTitle && (
        <h1 className="header-page-title">{pageTitle}</h1>
      )}
      {!hideSearch && !pageTitle && (
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          />
        </div>
      )}
      {hideSearch && !pageTitle && <div className="search-bar-placeholder"></div>}
      <div className="user-tools">
        <FiSettings />
        <FiBell />
        <div className="user-profile">
          <div className="header-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <span>{user?.firstName} {user?.lastName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

