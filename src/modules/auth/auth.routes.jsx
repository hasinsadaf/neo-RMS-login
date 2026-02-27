import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

export const authRoutes = [
  {
    path: '/:portal/login',
    element: <Login />,
  },
  {
    path: '/:portal/register',
    element: <Register />,
  },
];

export default authRoutes;