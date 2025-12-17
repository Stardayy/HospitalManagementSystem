import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, searchTerm, setSearchTerm, searchPlaceholder }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        {(searchTerm !== undefined || setSearchTerm) && (
          <Header 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder={searchPlaceholder || "Search..."} 
          />
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
