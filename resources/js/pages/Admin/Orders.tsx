import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

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
    payment_method: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items: OrderItem[];
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, status: string) => {
        try {
            await axios.put(`/api/orders/${orderId}`, { status });
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (error) {
            console.error('Failed to update order status', error);
            alert('Failed to update order status');
        }
    };

    const handlePaymentStatusUpdate = async (orderId: number, paymentStatus: string) => {
        try {
            await axios.put(`/api/orders/${orderId}`, { payment_status: paymentStatus });
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
            }
        } catch (error) {
            console.error('Failed to update payment status', error);
            alert('Failed to update payment status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Orders</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage customer orders</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by customer name, email, or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {order.user ? (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Guest</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${order.total_price.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(
                                            order.status
                                        )} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.payment_status}
                                        onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value)}
                                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(
                                            order.payment_status
                                        )} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">No orders found</div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Order #{selectedOrder.id}
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Customer
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {selectedOrder.user?.name || 'Guest'}
                                        </p>
                                        {selectedOrder.user?.email && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedOrder.user.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(selectedOrder.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Payment Method
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">{selectedOrder.payment_method}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Total Amount
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ${selectedOrder.total_price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        ${item.unit_price.toFixed(2)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    ${item.subtotal.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
