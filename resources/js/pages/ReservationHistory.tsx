import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { unwrapResourceCollection } from '@/lib/laravel';

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
}

const ReservationHistory = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('/api/reservations');
                setReservations(unwrapResourceCollection<Reservation>(response.data));
            } catch (error) {
                console.error('Failed to fetch reservations', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reservations</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your reservation history</p>
                </div>
                <Link
                    to="/reservations"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition"
                >
                    <CalendarPlus size={18} />
                    Book a table
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reservations.map((r) => (
                        <div key={r.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Reservation #{r.id}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {r.reservation_date} at {r.reservation_time} • party of {r.party_size}
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    {r.status}
                                </span>
                            </div>

                            {r.special_request && (
                                <div className="mt-3 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <span className="font-semibold">Special request:</span> {r.special_request}
                                </div>
                            )}
                        </div>
                    ))}

                    {reservations.length === 0 && (
                        <div className="p-10 text-center text-gray-600 dark:text-gray-400">No reservations yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationHistory;

