import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminOrders from './pages/Admin/Orders';
import AdminReservations from './pages/Admin/Reservations';

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
            {
                path: '/admin',
                element: (
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                ),
                children: [
                    { path: '/admin', element: <AdminDashboard /> },
                    { path: '/admin/products', element: <AdminProducts /> },
                    { path: '/admin/categories', element: <AdminCategories /> },
                    { path: '/admin/orders', element: <AdminOrders /> },
                    { path: '/admin/reservations', element: <AdminReservations /> },
                ],
            },
        ],
    },
]);

export default router;
