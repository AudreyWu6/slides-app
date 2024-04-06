import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function NaviBtn ({ to, children, onClick }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event); // 如果有传入的onClick处理函数，先执行它
    }
    navigate(to); // 然后导航
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
      fullWidth
      sx={{ mt: 3, mb: 2 }}
    >
      {children}
    </Button>
  );
}

export default NaviBtn;
//test
//test
//test
//test
