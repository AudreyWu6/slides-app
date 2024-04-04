import React from 'react';
import NaviBtn from './NaviBtn';

function Dashboard () {
  const handleLogout = () => {
    // 实现登出逻辑
    localStorage.removeItem('token');
  };

  return (
        <div>
            Dashboard
            <NaviBtn to="/" onClick={handleLogout}>Logout</NaviBtn>
        </div>
  );
}

export default Dashboard;
