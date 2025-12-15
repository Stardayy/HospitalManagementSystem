import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const Layout = () => {
    return (
      <div className="dashboard-container">
        //Keep the sidebar do not re-render when change page
        <Sidebar />
        <main className="main-content">
          <Outlet /> 
        </main>
      </div>
    );
  };
  
  export default Layout;