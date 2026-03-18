import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, ShoppingBag, Calendar, LogOut, Save, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

    const initialProfile = useMemo(
        () => ({
            name: user?.name ?? '',
            email: user?.email ?? '',
        }),
        [user]
    );

    const [profileForm, setProfileForm] = useState(initialProfile);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileSuccess(null);
        setProfileErrors({});
        try {
            const response = await axios.put('/api/profile', profileForm);
            setProfileSuccess(response.data?.message ?? 'Profile updated.');
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                setProfileErrors(errors);
            } else {
                setProfileErrors({ general: [error.response?.data?.message ?? 'Failed to update profile.'] });
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordSuccess(null);
        setPasswordErrors({});
        try {
            const response = await axios.put('/api/password', passwordForm);
            setPasswordSuccess(response.data?.message ?? 'Password updated.');
            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                setPasswordErrors(errors);
            } else {
                setPasswordErrors({ general: [error.response?.data?.message ?? 'Failed to update password.'] });
            }
        } finally {
            setSavingPassword(false);
        }
    };

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

                <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile details</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Update your name and email address.
                        </p>

                        {profileSuccess && (
                            <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 text-sm">
                                {profileSuccess}
                            </div>
                        )}

                        {profileErrors.general && (
                            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-3 text-sm">
                                {profileErrors.general.join(' ')}
                            </div>
                        )}

                        <form onSubmit={updateProfile} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {profileErrors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {profileErrors.name.join(' ')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {profileErrors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {profileErrors.email.join(' ')}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition disabled:opacity-70"
                            >
                                <Save size={18} />
                                {savingProfile ? 'Saving…' : 'Save changes'}
                            </button>
                        </form>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change password</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Use a strong password you don’t reuse elsewhere.
                        </p>

                        {passwordSuccess && (
                            <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 text-sm">
                                {passwordSuccess}
                            </div>
                        )}

                        {passwordErrors.general && (
                            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-3 text-sm">
                                {passwordErrors.general.join(' ')}
                            </div>
                        )}

                        <form onSubmit={updatePassword} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.current_password}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, current_password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {passwordErrors.current_password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {passwordErrors.current_password.join(' ')}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        New password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.password}
                                        onChange={(e) => setPasswordForm((p) => ({ ...p, password: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {passwordErrors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {passwordErrors.password.join(' ')}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.password_confirmation}
                                        onChange={(e) =>
                                            setPasswordForm((p) => ({ ...p, password_confirmation: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 transition disabled:opacity-70"
                            >
                                <KeyRound size={18} />
                                {savingPassword ? 'Updating…' : 'Update password'}
                            </button>
                        </form>
                    </div>

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

