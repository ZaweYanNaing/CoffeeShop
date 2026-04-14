import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Gift, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Transaction {
    id: number;
    points: number;
    type: string;
    description: string;
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    image: string | null;
    points_cost: number;
    is_available: boolean;
}

const Rewards = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rewardPoints, setRewardPoints] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [redeemableProducts, setRedeemableProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchRewards();
        fetchRedeemableProducts();
    }, [user]);

    const fetchRewards = async () => {
        try {
            const response = await axios.get('/api/rewards');
            setRewardPoints(response.data.reward_points);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Failed to fetch rewards', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRedeemableProducts = async () => {
        try {
            const response = await axios.get('/api/rewards/products');
            setRedeemableProducts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch redeemable products', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rewards Program</h1>
                <p className="text-gray-600 dark:text-gray-400">Earn points with every purchase and redeem them for free products!</p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-amber-100 mb-2">Your Reward Points</p>
                        <p className="text-5xl font-bold">{rewardPoints}</p>
                        <p className="text-amber-100 mt-2">Keep earning to unlock more rewards!</p>
                    </div>
                    <Award size={80} className="opacity-20" />
                </div>
            </div>

            {redeemableProducts.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redeem Your Points</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {redeemableProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{product.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Gift className="text-amber-600" size={20} />
                                            <span className="font-bold text-amber-600">{product.points_cost} points</span>
                                        </div>
                                        {rewardPoints >= product.points_cost ? (
                                            <span className="text-green-600 text-sm font-medium">Available</span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                Need {product.points_cost - rewardPoints} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Transaction History</h2>
                {transactions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet. Start ordering to earn points!</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {transaction.type === 'earned' ? (
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                                            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`font-bold text-lg ${
                                        transaction.points > 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {transaction.points > 0 ? '+' : ''}
                                    {transaction.points}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rewards;
