import React from 'react';
import { Coffee, Heart, Users, Award, MapPin, Clock } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            About The Daily Grind
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Your cozy sanctuary for exceptional coffee. Where every brew feels like home.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Coffee className="text-amber-600 dark:text-amber-400" size={32} />
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Story</h2>
                        </div>
                        <div className="prose prose-lg dark:prose-invert mx-auto text-gray-600 dark:text-gray-300">
                            <p className="text-lg leading-relaxed mb-6">
                                Founded in 2024, The Daily Grind began with a simple dream: to create a warm, welcoming space 
                                where coffee lovers could gather, connect, and enjoy exceptional brews crafted with passion 
                                and precision.
                            </p>
                            <p className="text-lg leading-relaxed mb-6">
                                What started as a small neighborhood café has grown into a beloved community hub, but our 
                                commitment remains unchanged. We source only the finest beans from sustainable farms around 
                                the world, roast them to perfection, and serve each cup with care.
                            </p>
                            <p className="text-lg leading-relaxed">
                                At The Daily Grind, we believe coffee is more than just a beverage—it's an experience, a moment 
                                of comfort, and a reason to slow down and savor life's simple pleasures.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 bg-amber-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                                <Heart className="text-amber-600 dark:text-amber-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Passion
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Every cup is crafted with love and dedication. We're passionate about delivering 
                                the perfect coffee experience.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                                <Users className="text-amber-600 dark:text-amber-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Community
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We're more than a café—we're a gathering place where friendships are formed and 
                                memories are made.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                                <Award className="text-amber-600 dark:text-amber-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Quality
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                From bean selection to the final pour, we never compromise on quality. Excellence 
                                is our standard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location & Hours Section */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Visit Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <MapPin className="text-amber-600 dark:text-amber-400" size={28} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h3>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                                123 Coffee Street
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                                Downtown District
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                City, State 12345
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                📞 +1 (555) 123-4567
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                ✉️ hello@brewhaven.com
                            </p>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <Clock className="text-amber-600 dark:text-amber-400" size={28} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Hours</h3>
                            </div>
                            <div className="space-y-3 text-lg">
                                <div className="flex justify-between md:justify-start md:gap-8">
                                    <span className="text-gray-900 dark:text-white font-medium">Monday - Friday</span>
                                    <span className="text-gray-600 dark:text-gray-300">7:00 AM - 9:00 PM</span>
                                </div>
                                <div className="flex justify-between md:justify-start md:gap-8">
                                    <span className="text-gray-900 dark:text-white font-medium">Saturday</span>
                                    <span className="text-gray-600 dark:text-gray-300">8:00 AM - 10:00 PM</span>
                                </div>
                                <div className="flex justify-between md:justify-start md:gap-8">
                                    <span className="text-gray-900 dark:text-white font-medium">Sunday</span>
                                    <span className="text-gray-600 dark:text-gray-300">8:00 AM - 8:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Experience The Daily Grind?
                    </h2>
                    <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
                        Join our community of coffee lovers and discover your new favorite brew.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/menu"
                            className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition shadow-lg"
                        >
                            View Menu
                        </a>
                        <a
                            href="/reservations"
                            className="inline-block bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition shadow-lg"
                        >
                            Make a Reservation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
