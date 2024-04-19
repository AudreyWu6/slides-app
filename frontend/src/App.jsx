import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route, Navigate,
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import EditPresentation from './components/EditPresentation';
import { PresentationProvider } from './components/PresentationContext';
import PreviewPresentation from './components/PreviewPresentation';
import ReorderSlides from './components/ReorderSlides';

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
          </Routes>
        </div>
      </Router>
    </PresentationProvider>
  );
};

export default App;

// the structure of presto:
//   users layer: contain multiple slides:  user {id, name, ... , store{pptList{ppt1, ppt2, ...}}}
//   ppt layer: contain multiple slides:          ppt {id, name, versions}
//   version layer: contain multiple versions          versions{timestamp, slides, theme}
//   slide layer: contain multiple elements                slides{id, elements}
//   element layer: contains multiple attributes               elements{id, type, position ... }
