import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';


// Import từ thư mục patient
import AIConsult from './components/patient/AIConsult';
import UpdateHealth from './components/patient/UpdateHealth';

// Import từ thư mục admin 
import CreateDoctor from './components/admin/CreateDoctor';
import AdminStats from './components/admin/AdminStats';

// Import từ thư mục doctor 
import DoctorHome from './components/doctor/DoctorHome';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Tuyến đường cho Bệnh nhân */}
        <Route path="/ai-consult" element={<AIConsult />} />
        <Route path="/update-health" element={<UpdateHealth />} />

        {/* Tuyến đường cho Admin */}
        <Route path="/admin/create-doctor" element={<CreateDoctor />} />
        <Route path="/admin/stats" element={<AdminStats />} />

        {/* Tuyến đường cho Bác sĩ */}
        <Route path="/doctor/home" element={<DoctorHome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;