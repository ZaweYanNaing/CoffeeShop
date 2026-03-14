import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Eye, Calendar } from 'lucide-react';

interface Reservation {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    reservation_date: string;
    reservation_time: string;
    party_size: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    special_request: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Failed to fetch reservations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reservationId: number, status: string) => {
        try {
            await axios.put(`/api/reservations/${reservationId}`, { status });
            fetchReservations();
            if (selectedReservation?.id === reservationId) {
                setSelectedReservation({ ...selectedReservation, status });
            }
        } catch (error) {
            console.error('Failed to update reservation status', error);
            alert('Failed to update reservation status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const filteredReservations = reservations.filter((reservation) => {
        const matchesSearch =
            reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reservations</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage table reservations</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or reservation ID..."
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
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Reservation ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Party Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredReservations.map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        #{reservation.id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {reservation.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.email}</div>
                                        {reservation.phone && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{reservation.phone}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {new Date(reservation.reservation_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.reservation_time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {reservation.party_size} {reservation.party_size === 1 ? 'guest' : 'guests'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={reservation.status}
                                        onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(
                                            reservation.status
                                        )} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {new Date(reservation.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(reservation.created_at).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => setSelectedReservation(reservation)}
                                        className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredReservations.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">No reservations found</div>
                )}
            </div>

            {/* Reservation Detail Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Reservation #{selectedReservation.id}
                                </h2>
                                <button
                                    onClick={() => setSelectedReservation(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Customer Name
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">{selectedReservation.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                                        <p className="text-gray-900 dark:text-white">{selectedReservation.email}</p>
                                    </div>
                                    {selectedReservation.phone && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h3>
                                            <p className="text-gray-900 dark:text-white">{selectedReservation.phone}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Party Size
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {selectedReservation.party_size} {selectedReservation.party_size === 1 ? 'guest' : 'guests'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(selectedReservation.reservation_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time</h3>
                                        <p className="text-gray-900 dark:text-white">{selectedReservation.reservation_time}</p>
                                    </div>
                                </div>

                                {selectedReservation.special_request && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Special Request
                                        </h3>
                                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            {selectedReservation.special_request}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h3>
                                    <select
                                        value={selectedReservation.status}
                                        onChange={(e) => handleStatusUpdate(selectedReservation.id, e.target.value)}
                                        className={`px-4 py-2 rounded-lg border-0 ${getStatusColor(
                                            selectedReservation.status
                                        )} focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservations;
