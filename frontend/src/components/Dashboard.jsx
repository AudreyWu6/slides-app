import React from 'react';
import NaviBtn from './NaviBtn';
import SlideEditor from './SlideEditor';

function Dashboard () {
  const handleLogout = () => {
    // 实现登出逻辑
    localStorage.removeItem('token');
  };

  return (
        <div>
            Dashboard
            <SlideEditor></SlideEditor>
            <NaviBtn to="/login" onClick={handleLogout}>Logout</NaviBtn>
        </div>

  );
}

export default Dashboard;
