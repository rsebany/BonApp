BonApp  | Laravel + React Starter Kit
Introduction
BonApp is a modern food delivery system built with Laravel and React. Whether you're exploring a new city or on a road trip, BonApp helps you discover and order from the best restaurants around you. With a responsive and intuitive interface, users can easily browse menus, track orders, and enjoy meals while on the move.

This project leverages the power of Laravel for the backend and React 19 on the frontend, all seamlessly connected through Inertia.js. It’s designed for speed, reliability, and developer productivity.

Features
🔍 Location-based restaurant search

🍽️ Dynamic restaurant listings and menus

🚚 Real-time order tracking

💳 Secure payment integration

🧾 Order history and receipts

🌍 Multilingual and mobile-responsive design

Tech Stack
Backend: Laravel 11+

Frontend: React 19, TypeScript

UI: Tailwind CSS, shadcn/ui, Radix UI

Routing: Inertia.js

Build Tool: Vite

API: REST & Laravel Sanctum for authentication

Getting Started
Prerequisites
PHP 8.2+

Node.js 18+

Composer

MySQL or PostgreSQL

Laravel CLI

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/bonapp.git
cd bonapp
Install dependencies:

bash
Copy
Edit
composer install
npm install
Copy the .env file and configure your environment:

bash
Copy
Edit
cp .env.example .env
php artisan key:generate
Run migrations and seed the database:

bash
Copy
Edit
php artisan migrate --seed
Start the development servers:

bash
Copy
Edit
npm run dev
php artisan serve
Contributing
Thank you for considering contributing to BonApp! Please review the Laravel Contribution Guide before submitting your pull requests.

Code of Conduct
Please review and respect the Laravel Code of Conduct to help us maintain a welcoming community.

License
BonApp is open-source software licensed under the MIT license.
