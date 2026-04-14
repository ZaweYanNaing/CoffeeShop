import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { Loader2, Plus, Gift } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: Category;
    is_available: boolean;
    points_reward: number;
    points_cost: number | null;
}

const Menu = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/products')
                ]);
                setCategories(categoriesRes.data.data);
                setProducts(productsRes.data.data);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category.id === selectedCategory)
        : products;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-amber-600" size={48} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Our Menu</h1>

            {/* Categories Filter */}
            <div className="flex overflow-x-auto gap-4 mb-8 pb-2 justify-center">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === null
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    All
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === category.id
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            {!product.is_available && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                                    Sold Out
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                                <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                                {product.description}
                            </p>
                            {product.points_reward > 0 && (
                                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs mb-3">
                                    <Gift size={14} />
                                    <span>Earn {product.points_reward} points</span>
                                </div>
                            )}
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.is_available}
                                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition ${product.is_available
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Plus size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default Menu;
