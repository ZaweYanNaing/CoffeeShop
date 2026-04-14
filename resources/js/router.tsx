import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import ReservationHistory from './pages/ReservationHistory';
import Rewards from './pages/Rewards';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminOrders from './pages/Admin/Orders';
import AdminReservations from './pages/Admin/Reservations';
import AdminCustomers from './pages/Admin/Customers';

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
                path: '/profile',
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/my-orders',
                element: (
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/my-reservations',
                element: (
                    <ProtectedRoute>
                        <ReservationHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/rewards',
                element: (
                    <ProtectedRoute>
                        <Rewards />
                    </ProtectedRoute>
                ),
            },
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
                    { path: '/admin/customers', element: <AdminCustomers /> },
                ],
            },
        ],
    },
]);

export default router;
