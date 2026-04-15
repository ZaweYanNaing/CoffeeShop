import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, FolderTree, ShoppingBag, Calendar, DollarSign, Users, UserCheck } from 'lucide-react';
import { unwrapResourceCollection } from '@/lib/laravel';
import DailyIncomeChart from '@/components/DailyIncomeChart';

interface Stats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalReservations: number;
    pendingOrders: number;
    pendingReservations: number;
    totalRevenue: number;
    totalCustomers: number;
    activeCustomers: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, categoriesRes, ordersRes, reservationsRes, customersRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/categories'),
                axios.get('/api/orders'),
                axios.get('/api/reservations'),
                axios.get('/api/customers/stats'),
            ]);

            const products = unwrapResourceCollection<any>(productsRes.data);
            const categories = unwrapResourceCollection<any>(categoriesRes.data);
            const orders = unwrapResourceCollection<any>(ordersRes.data);
            const reservations = unwrapResourceCollection<any>(reservationsRes.data);
            const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
            const pendingReservations = reservations.filter((r: any) => r.status === 'pending').length;
            const totalRevenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total_price || 0), 0);

            setStats({
                totalProducts: products.length,
                totalCategories: categories.length,
                totalOrders: orders.length,
                totalReservations: reservations.length,
                pendingOrders,
                pendingReservations,
                totalRevenue,
                totalCustomers: customersRes.data.total_customers,
                activeCustomers: customersRes.data.active_customers,
            });
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-blue-500',
            link: '/admin/products',
        },
        {
            title: 'Total Categories',
            value: stats?.totalCategories || 0,
            icon: FolderTree,
            color: 'bg-green-500',
            link: '/admin/categories',
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'bg-purple-500',
            link: '/admin/orders',
        },
        {
            title: 'Total Reservations',
            value: stats?.totalReservations || 0,
            icon: Calendar,
            color: 'bg-orange-500',
            link: '/admin/reservations',
        },
        {
            title: 'Total Customers',
            value: stats?.totalCustomers || 0,
            icon: Users,
            color: 'bg-indigo-500',
            link: '/admin/customers',
        },
        {
            title: 'Active Customers',
            value: stats?.activeCustomers || 0,
            icon: UserCheck,
            color: 'bg-teal-500',
            link: '/admin/customers',
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: ShoppingBag,
            color: 'bg-yellow-500',
            link: '/admin/orders?status=pending',
        },
        {
            title: 'Pending Reservations',
            value: stats?.pendingReservations || 0,
            icon: Calendar,
            color: 'bg-yellow-500',
            link: '/admin/reservations?status=pending',
        },
        {
            title: 'Total Revenue',
            value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`,
            icon: DollarSign,
            color: 'bg-emerald-500',
            link: '/admin/orders',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's an overview of Brew Haven.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.title}
                            to={stat.link}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8">
                <DailyIncomeChart />
            </div>
        </div>
    );
};

export default AdminDashboard;
