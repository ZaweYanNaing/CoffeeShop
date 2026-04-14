import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Ban, CheckCircle, Users, UserCheck } from 'lucide-react';
import { unwrapResourceCollection } from '@/lib/laravel';

interface Customer {
    id: number;
    name: string;
    email: string;
    created_at: string;
    orders_count: number;
    reservations_count: number;
    is_banned: boolean;
    banned_at: string | null;
}

const AdminCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({ total_customers: 0, active_customers: 0 });

    useEffect(() => {
        fetchCustomers();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/customers/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/customers', {
                params: { search: search || undefined },
            });
            const data = unwrapResourceCollection<Customer>(response.data);
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCustomers();
    };

    const handleBan = async (id: number) => {
        if (!confirm('Are you sure you want to ban this customer? They will not be able to access their account.')) {
            return;
        }

        try {
            await axios.post(`/api/customers/${id}/ban`);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to ban customer', error);
            alert('Failed to ban customer');
        }
    };

    const handleUnban = async (id: number) => {
        if (!confirm('Are you sure you want to unban this customer?')) {
            return;
        }

        try {
            await axios.post(`/api/customers/${id}/unban`);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to unban customer', error);
            alert('Failed to unban customer');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your coffee shop customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_customers}</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Users className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.active_customers}</p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <UserCheck className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Reservations
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {customer.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {customer.orders_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                {customer.reservations_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {customer.is_banned ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                    Banned
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {customer.is_banned ? (
                                                <button
                                                    onClick={() => handleUnban(customer.id)}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center gap-1"
                                                    title="Unban customer"
                                                >
                                                    <CheckCircle size={18} />
                                                    <span>Unban</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBan(customer.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center gap-1"
                                                    title="Ban customer"
                                                >
                                                    <Ban size={18} />
                                                    <span>Ban</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
