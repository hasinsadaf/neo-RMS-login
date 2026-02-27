import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authRoutes from './modules/auth/auth.routes.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/customer/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;