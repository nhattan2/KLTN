import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AIConsult from './components/AIConsult';
import UpdateHealth from './components/UpdateHealth';
import CreateMedicalRecord from './components/CreateMedicalRecord';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào trang Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-consult" element={<AIConsult />} />
        <Route path="/update-health" element={<UpdateHealth />} />
        <Route path="/create-record" element={<CreateMedicalRecord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;