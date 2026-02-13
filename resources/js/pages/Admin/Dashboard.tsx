import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Orders</h3>
                    <p className="text-gray-600 dark:text-gray-400">View and manage customer orders.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Reservations</h3>
                    <p className="text-gray-600 dark:text-gray-400">Manage table bookings.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Menu Items</h3>
                    <p className="text-gray-600 dark:text-gray-400">Add or edit products.</p>
                </div>
            </div>
            <p className="mt-8 text-center text-gray-500">Admin features are implemented in the API. Frontend interface coming soon.</p>
        </div>
    );
};

export default AdminDashboard;
