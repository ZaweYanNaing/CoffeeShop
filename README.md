# Brew Haven ☕🏠

A modern coffee shop management system with customer ordering, rewards program, admin dashboard, and AI-powered recommendations.

## Admin Credentials
Email: admin@coffee.com
Password: password

## Features
- AI Coffee Concierge (powered by Google Gemini) - Natural language menu recommendations
- Customer ordering system with cart
- Rewards points program
- Payment proof upload
- Admin dashboard with analytics
- Customer management
- Product management
- Order management
- Reservation system

## Setup

1. Install dependencies:
   ```bash
   composer install
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Set up database:
   ```bash
   php artisan migrate --seed
   ```

4. Configure AI Coffee Concierge:
   - Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Add to `.env`: `GEMINI_API_KEY=AIzaSy...your_key_here`
   - Clear config: `php artisan config:clear`
   - Model: `gemini-2.5-flash` (stable, fast, free tier: 15 req/min)
   - See `AI_CONCIERGE_SETUP.md` for troubleshooting

5. Build frontend:
   ```bash
   npm run build
   ```

6. Start the server:
   ```bash
   php artisan serve
   ```