import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard () {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 实现登出逻辑
    navigate('/login');
    localStorage.removeItem('token');
  };

  return (
        <div>
            Dashboard
            <button onClick={handleLogout}>Logout</button>
        </div>
  );
}

export default Dashboard;
