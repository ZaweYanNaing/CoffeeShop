import React, { useMemo } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/Admin/Dashboard'; // Placeholder

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/menu', element: <Menu /> },
            { path: '/cart', element: <Cart /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/reservations', element: <Reservations /> },
            { path: '/admin', element: <AdminDashboard /> },
        ],
    },
]);

export default router;
