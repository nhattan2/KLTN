import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';


// Import từ thư mục patient
import AIConsult from './components/patient/AIConsult';
import UpdateHealth from './components/patient/UpdateHealth';
import CreateMedicalRecord from './components/patient/CreateMedicalRecord';
import MyRecords from './components/patient/MyRecords';
import BookAppointment from './components/patient/BookAppointment';
import PaymentHistory from './components/patient/PaymentHistory';

// Import từ thư mục admin 
import CreateDoctor from './components/admin/CreateDoctor';
import AdminStats from './components/admin/AdminStats';
import AdminDoctors from './components/admin/AdminDoctors';
import AdminServices from './components/admin/AdminServices';
import AdminPaymentStats from './components/admin/AdminPaymentStats';

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
        <Route path="/create-record" element={<CreateMedicalRecord />} />
        <Route path="/my-records" element={<MyRecords />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/payment/history" element={<PaymentHistory />} />


        {/* Tuyến đường cho Admin */}
        <Route path="/admin/create-doctor" element={<CreateDoctor />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/payment-stats" element={<AdminPaymentStats />} />

        {/* Tuyến đường cho Bác sĩ */}
        <Route path="/doctor/home" element={<DoctorHome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;