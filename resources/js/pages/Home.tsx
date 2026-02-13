import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white dark:bg-gray-900 overflow-hidden">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-gray-900/20 dark:hover:ring-white/20">
                            Announcing our new seasonal blends. <Link to="/menu" className="font-semibold text-amber-600 dark:text-amber-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                        Coffee that tells a story in every sip.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Experience the art of coffee with our handcrafted brews, sourced from the finest beans around the world.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/menu" className="rounded-md bg-amber-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
                            Order Now
                        </Link>
                        <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-amber-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-amber-600 dark:text-amber-400">Craftsmanship</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need for the perfect cup
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            We take pride in every step of the process, from bean selection to the final pour.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {[
                                {
                                    name: 'Ethically Sourced',
                                    description: 'We work directly with farmers to ensure fair wages and sustainable practices.',
                                    icon: Coffee,
                                },
                                {
                                    name: 'Expertly Roasted',
                                    description: 'Our master roasters bring out the unique flavor profiles of each bean.',
                                    icon: Star,
                                },
                                {
                                    name: 'Fast Delivery',
                                    description: 'Freshly roasted coffee delivered straight to your door.',
                                    icon: ArrowRight,
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
                                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
