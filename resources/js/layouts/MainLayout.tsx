import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MainLayout = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2">
                        ☕ CoffeeShop
                    </Link>

                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
                        <Link to="/menu" className="hover:text-amber-600 transition">Menu</Link>
                        {user && <Link to="/reservations" className="hover:text-amber-600 transition">Reservations</Link>}
                        {user?.is_admin && <Link to="/admin" className="hover:text-amber-600 transition text-red-500 font-bold">Admin</Link>}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-300" />
                                </button>

                                <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/my-orders"
                                        className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        My orders
                                    </Link>
                                    <Link
                                        to="/my-reservations"
                                        className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        My reservations
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <User size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="grow">
                <Outlet />
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Coffee Shop. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
