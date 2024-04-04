import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Dashboard from './components/Dashboard'; // 确保Dashboard.jsx的路径正确
import Login from './components/Login'; // 确保Login.jsx的路径正确
import Register from './components/Register'; // 确保Register.jsx的路径正确

const App = () => {
  return (
      <Router>
        <div>
          <nav>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* 这里可以添加更多路由 */}
          </Routes>
        </div>
      </Router>
  );
};

export default App;
