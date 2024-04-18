import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { apiRequest } from './api';
import NaviBtn from './NaviBtn';
import Alert from './Alert';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await apiRequest('/admin/auth/login', 'POST', {
        email,
        password,
      });
      console.log('Login success:', data.token);
      localStorage.setItem('token', data.token);
      // 处理登录成功逻辑，比如保存token，导航到另一个页面等
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
      setOpenAlert(true); // 显示Alert
      // 处理登录失败逻辑
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            data-cy="login-button"
          >
            Sign In
          </Button>
          <Alert
            open={openAlert}
            handleClose={handleCloseAlert}
            severity="error"
            message="Login failed. Please try again."
          />
        </Box>
        <NaviBtn to="/register">Register</NaviBtn>
      </Box>
    </Container>
  );
}

export default Login;
