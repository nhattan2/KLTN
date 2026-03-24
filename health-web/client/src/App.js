import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <nav style={{ textAlign: 'center', padding: '20px' }}>
        <Link to="/login" style={{ margin: '10px' }}>Đăng nhập</Link>
        <Link to="/register" style={{ margin: '10px' }}>Đăng ký</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;