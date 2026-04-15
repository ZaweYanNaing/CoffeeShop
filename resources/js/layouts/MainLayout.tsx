import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MainLayout = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect admin users from customer pages to admin dashboard
    useEffect(() => {
        if (user?.is_admin && (location.pathname === '/' || location.pathname === '/menu' || location.pathname === '/reservations')) {
            navigate('/admin', { replace: true });
        }
    }, [user, location.pathname, navigate]);

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
                        🏠☕ Brew Haven
                    </Link>

                    <div className="hidden md:flex space-x-6 items-center">
                        {user?.is_admin ? (
                            <Link to="/admin" className="hover:text-amber-600 transition text-red-500 font-bold">Admin Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/" className="hover:text-amber-600 transition">Home</Link>
                                <Link to="/menu" className="hover:text-amber-600 transition">Menu</Link>
                                <Link to="/about" className="hover:text-amber-600 transition">About</Link>
                                {user && <Link to="/reservations" className="hover:text-amber-600 transition">Reservations</Link>}
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        {!user?.is_admin && (
                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
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
                                    {!user?.is_admin && (
                                        <>
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
                                            <Link
                                                to="/rewards"
                                                className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                Rewards
                                            </Link>
                                        </>
                                    )}
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

            <footer className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border-t border-amber-200 dark:border-gray-700 mt-12">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">🏠☕</span>
                                <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500">Brew Haven</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your cozy sanctuary for exceptional coffee. Where every brew feels like home.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/menu" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition">
                                        Menu
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/reservations" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition">
                                        Reservations
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/rewards" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition">
                                        Rewards
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li>📍 123 Coffee Street</li>
                                <li>📞 +1 (555) 123-4567</li>
                                <li>✉️ hello@brewhaven.com</li>
                                <li>🕒 Mon-Sun: 7AM - 9PM</li>
                            </ul>
                        </div>

                        {/* Social & Newsletter */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stay Connected</h4>
                            <div className="flex gap-3 mb-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition">
                                    <span className="text-sm font-bold">f</span>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition">
                                    <span className="text-sm font-bold">𝕏</span>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition">
                                    <span className="text-sm font-bold">in</span>
                                </a>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Follow us for updates, special offers, and coffee inspiration!
                            </p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-amber-200 dark:border-gray-700 mt-8 pt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Brew Haven. All rights reserved. Made with ❤️ and ☕
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
