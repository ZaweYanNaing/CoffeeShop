import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, Clock, Users, MessageSquare } from 'lucide-react';

const Reservations = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [partySize, setPartySize] = useState(2);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Could pre-fill from user
    const [phone, setPhone] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/reservations', {
                reservation_date: date,
                reservation_time: time,
                party_size: partySize,
                name: user ? user.name : name,
                email: user ? user.email : email,
                phone,
                special_request: specialRequest
            });
            setSuccess(true);
        } catch (error) {
            console.error('Reservation failed', error);
            alert('Failed to make reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-lg">
                <div className="bg-green-100 dark:bg-green-900/30 p-8 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                    <Calendar size={48} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 dark:text-white">Reservation Confirmed!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    We look forward to hosting you on {date} at {time}. A confirmation email has been sent.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
                >
                    Make Another Reservation
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Book a Table</h1>

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <span className="flex items-center gap-2"><Calendar size={16} /> Date</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <span className="flex items-center gap-2"><Clock size={16} /> Time</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="flex items-center gap-2"><Users size={16} /> Party Size</span>
                        </label>
                        <select
                            value={partySize}
                            onChange={(e) => setPartySize(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} People</option>
                            ))}
                        </select>
                    </div>

                    {!user && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="flex items-center gap-2"><MessageSquare size={16} /> Special Requests</span>
                        </label>
                        <textarea
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows={3}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-md transition duration-200 flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Confirm Reservation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reservations;
