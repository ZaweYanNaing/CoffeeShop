import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, ShoppingBag, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <UserCircle className="text-amber-700 dark:text-amber-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/my-orders"
                        className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 transition"
                    >
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <ShoppingBag className="text-amber-700 dark:text-amber-400" size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Order history</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">View your past orders</p>
                        </div>
                    </Link>

                    <Link
                        to="/my-reservations"
                        className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 transition"
                    >
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Calendar className="text-amber-700 dark:text-amber-400" size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Reservation history</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your bookings</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;

