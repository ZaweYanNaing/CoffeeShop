import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { unwrapResourceCollection } from '@/lib/laravel';

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
    };
}

interface Order {
    id: number;
    total_price: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed';
    payment_method: string | null;
    created_at: string;
    items: OrderItem[];
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders');
                setOrders(unwrapResourceCollection<Order>(response.data));
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your order history</p>
                </div>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition"
                >
                    <ShoppingBag size={18} />
                    Order again
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                        <div key={order.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${order.total_price.toFixed(2)}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                        {order.status}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                        payment: {order.payment_status}
                                    </span>
                                </div>
                            </div>

                            {order.items?.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    ${item.unit_price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                ${item.subtotal.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="p-10 text-center text-gray-600 dark:text-gray-400">No orders yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;

