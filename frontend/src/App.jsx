import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route, Navigate,
} from 'react-router-dom';
import Dashboard from './components/Dashboard'; // 确保Dashboard.jsx的路径正确
import Login from './components/Login'; // 确保Login.jsx的路径正确
import Register from './components/Register'; // 确保Register.jsx的路径正确
import EditPresentation from './components/EditPresentation';
import { PresentationProvider } from './components/PresentationContext';
import PreviewPresentation from './components/PreviewPresentation';
import ReorderSlides from './components/ReorderSlides';
import './App.css';

const App = () => {
  return (
    <PresentationProvider>
      <Router>
        <div>
          <nav>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-presentation/:id/slide/:slideNumber" element={<EditPresentation />} />
            <Route path="/preview-presentation/:id/slide/:slideNumber" element={<PreviewPresentation />} />
            <Route path="/reorder-slides/:id" element={<ReorderSlides />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate replace to="/login" />} />
            {/* 这里可以添加更多路由 */}
          </Routes>
        </div>
      </Router>
    </PresentationProvider>
  );
};

export default App;
