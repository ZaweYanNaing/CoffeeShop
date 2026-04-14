import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DailyIncomeData {
    date: string;
    total: string;
}

interface ChartData {
    date: string;
    income: number;
}

const DailyIncomeChart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchDailyIncome();
    }, [days]);

    const fetchDailyIncome = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/analytics/daily-income?days=${days}`);
            const chartData: ChartData[] = response.data.data.map((item: DailyIncomeData) => ({
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                income: parseFloat(item.total),
            }));
            setData(chartData);
        } catch (error) {
            console.error('Failed to fetch daily income', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Income</h2>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                    <option value={7}>Last 7 days</option>
                    <option value={14}>Last 14 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={60}>Last 60 days</option>
                    <option value={90}>Last 90 days</option>
                </select>
            </div>

            {data.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                    No income data available for the selected period
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                        <XAxis
                            dataKey="date"
                            className="text-gray-600 dark:text-gray-400"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            className="text-gray-600 dark:text-gray-400"
                            tick={{ fill: 'currentColor' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                            formatter={(value: number | string) => [`$${Number(value).toFixed(2)}`, 'Income']}
                        />
                        <Legend />
                        <Bar dataKey="income" fill="#d97706" name="Daily Income" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default DailyIncomeChart;
