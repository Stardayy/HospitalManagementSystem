import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import Layout from './component/Layout';

//Import pages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Departments from './pages/Departments';
import DoctorsSchedule from './pages/DoctorsSchedule';
import Payments from './pages/Payments';
import Inventory from './pages/Inventory';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes - All authenticated users */}
          {/*<Route element={<Layout />}>*/}

            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />

            {/* Admin and Doctor routes */}
            <Route path="/patients" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="/doctors" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Doctors />
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Departments />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                <DoctorsSchedule />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Inventory />
              </ProtectedRoute>
            } />
            
          {/*</Route>*/}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;