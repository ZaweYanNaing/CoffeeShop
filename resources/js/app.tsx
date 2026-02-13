import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import '../css/app.css';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>
                <CartProvider>
                    <RouterProvider router={router} />
                </CartProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}
