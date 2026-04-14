import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cart.length === 0) return;

        setLoading(true);

        try {
            // Transform cart to order items structure
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            await axios.post('/api/orders', {
                items,
                payment_method: 'card' // Hardcoded for demo
            });

            clearCart();
            alert('Order placed successfully!');
            navigate('/my-orders');
        } catch (error) {
            console.error('Order failed', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow mt-8">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Your Cart is Empty</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">It looks like you haven't added any coffee yet.</p>
                <Link to="/menu" className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Your Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        {cart.map(item => (
                            <div key={item.id} className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg dark:text-white">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">${Number(item.price).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-medium w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (5%)</span>
                                <span>${(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg dark:text-white">
                                <span>Total</span>
                                <span>${(cartTotal * 1.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className={`w-full bg-amber-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <CreditCard size={20} />
                            {loading ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
