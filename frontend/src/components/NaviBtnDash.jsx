import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function NaviBtn ({ to, children, onClick }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    navigate(to);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ textDecoration: 'none', width: '205px', marginBottom: '5px' }}
      // width= "205px"
      height= "50px"
      sx={{ ml: 1 }}
    >
      {children}
    </Button>
  );
}

export default NaviBtn;
