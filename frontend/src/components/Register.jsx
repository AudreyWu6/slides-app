import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { apiRequest } from './api';
import NaviBtn from './NaviBtn';
import Alert from './Alert';

function Register () {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setOpenAlert(true); // 显示Alert
      return;
    }
    try {
      const { email, password, name } = formData;
      console.log(email, password, name);
      const data = await apiRequest('/admin/auth/register', 'POST', { email, name, password });
      console.log('Registration successful:', data);
      localStorage.setItem('token', data.token);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed.');
      setOpenAlert(true); // 显示Alert
    }
    console.log('Form data submitted:', formData);
    navigate('/Dashboard');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="name"
            type="name"
            id="name"
            autoComplete="current-name"
            value={formData.name}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Alert
            open={openAlert}
            handleClose={handleCloseAlert}
            severity="error"
            message={error}
          />
        </Box>
        <NaviBtn fullWidth to="/login">Login</NaviBtn>
      </Box>
    </Container>
  );
}

export default Register;
