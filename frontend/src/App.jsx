import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import MedicalRecords from './pages/MedicalRecords';
import Rooms from './pages/Rooms';
import Lab from './pages/Lab';
import VitalSigns from './pages/VitalSigns';
import Admissions from './pages/Admissions';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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

          {/* Admin and Doctor routes */}
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="/medical-records" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
              <MedicalRecords />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/departments" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Departments />
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Rooms />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
              <DoctorsSchedule />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/lab" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
              <Lab />
            </ProtectedRoute>
          } />
          <Route path="/vitals" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
              <VitalSigns />
            </ProtectedRoute>
          } />
          <Route path="/admissions" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
              <Admissions />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
              <Documents />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;