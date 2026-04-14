import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, Gift } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [paymentProof, setPaymentProof] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [rewardPoints, setRewardPoints] = React.useState(0);
    const [usePointsFor, setUsePointsFor] = React.useState<Record<number, boolean>>({});

    React.useEffect(() => {
        if (user) {
            fetchRewardPoints();
        }
    }, [user]);

    const fetchRewardPoints = async () => {
        try {
            const response = await axios.get('/api/rewards');
            setRewardPoints(response.data.reward_points);
        } catch (error) {
            console.error('Failed to fetch reward points', error);
        }
    };

    const toggleUsePoints = (productId: number) => {
        setUsePointsFor(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const calculateTotals = () => {
        let cashTotal = 0;
        let pointsTotal = 0;

        cart.forEach(item => {
            if (usePointsFor[item.id] && item.points_cost) {
                pointsTotal += item.points_cost * item.quantity;
            } else {
                cashTotal += item.price * item.quantity;
            }
        });

        return { cashTotal, pointsTotal };
    };

    const { cashTotal, pointsTotal } = calculateTotals();
    const needsPaymentProof = cashTotal > 0;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cart.length === 0) return;

        if (pointsTotal > rewardPoints) {
            alert(`Insufficient reward points. You need ${pointsTotal} points but only have ${rewardPoints}.`);
            return;
        }

        if (needsPaymentProof && !paymentProof) {
            alert('Please upload payment proof before checkout');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            
            cart.forEach((item, index) => {
                formData.append(`items[${index}][product_id]`, item.id.toString());
                formData.append(`items[${index}][quantity]`, item.quantity.toString());
                if (usePointsFor[item.id]) {
                    formData.append(`items[${index}][use_points]`, 'true');
                }
            });
            
            formData.append('payment_method', 'bank_transfer');
            if (paymentProof) {
                formData.append('payment_proof', paymentProof);
            }

            await axios.post('/api/orders', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            clearCart();
            if (needsPaymentProof) {
                alert('Order placed successfully! Please wait for admin to confirm your payment.');
            } else {
                alert('Order placed successfully using your reward points!');
            }
            navigate('/my-orders');
        } catch (error: any) {
            console.error('Order failed', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
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
                    {user && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Gift className="text-amber-600 dark:text-amber-400" size={20} />
                                <span className="font-medium text-amber-900 dark:text-amber-100">
                                    Your Reward Points: {rewardPoints}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        {cart.map(item => (
                            <div key={item.id} className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="grow">
                                        <h3 className="font-semibold text-lg dark:text-white">{item.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {usePointsFor[item.id] && item.points_cost ? (
                                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                                                    {item.points_cost} points each
                                                </span>
                                            ) : (
                                                `$${Number(item.price).toFixed(2)}`
                                            )}
                                        </p>
                                        {item.points_cost && (
                                            <button
                                                onClick={() => toggleUsePoints(item.id)}
                                                className={`mt-2 text-xs px-3 py-1 rounded-full transition ${
                                                    usePointsFor[item.id]
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {usePointsFor[item.id] ? '✓ Using Points' : `Use ${item.points_cost} points`}
                                            </button>
                                        )}
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
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                            {cashTotal > 0 && (
                                <>
                                    <div className="flex justify-between">
                                        <span>Cash Subtotal</span>
                                        <span>${cashTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (5%)</span>
                                        <span>${(cashTotal * 0.05).toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {pointsTotal > 0 && (
                                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                                    <span>Points Total</span>
                                    <span>{pointsTotal} points</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                            {cashTotal > 0 && (
                                <div className="flex justify-between font-bold text-lg dark:text-white mb-2">
                                    <span>Cash Total</span>
                                    <span>${(cashTotal * 1.05).toFixed(2)}</span>
                                </div>
                            )}
                            {pointsTotal > 0 && (
                                <div className="flex justify-between font-bold text-lg text-amber-600 dark:text-amber-400">
                                    <span>Points Required</span>
                                    <span>{pointsTotal} pts</span>
                                </div>
                            )}
                        </div>

                        {pointsTotal > rewardPoints && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Insufficient points! You need {pointsTotal - rewardPoints} more points.
                                </p>
                            </div>
                        )}

                        {needsPaymentProof && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Upload Payment Proof (Required)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-amber-50 file:text-amber-700
                                        hover:file:bg-amber-100
                                        dark:file:bg-amber-900 dark:file:text-amber-300"
                                />
                                {previewUrl && (
                                    <div className="mt-3">
                                        <img
                                            src={previewUrl}
                                            alt="Payment proof preview"
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Please upload a screenshot or photo of your bank transfer
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={loading || (needsPaymentProof && !paymentProof) || pointsTotal > rewardPoints}
                            className={`w-full bg-amber-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition ${loading || (needsPaymentProof && !paymentProof) || pointsTotal > rewardPoints ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {pointsTotal > 0 && cashTotal === 0 ? <Gift size={20} /> : <CreditCard size={20} />}
                            {loading ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
