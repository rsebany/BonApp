# BonApp 🍔 | Laravel + React Starter Kit

![BonApp Banner](https://via.placeholder.com/1200x400?text=BonApp+Food+Delivery) <!-- Replace with your actual banner image -->

BonApp is a modern food delivery system built with Laravel and React. Whether you're exploring a new city or on a road trip, BonApp helps you discover and order from the best restaurants around you.

## ✨ Features

- 🔍 Location-based restaurant search
- 🍽️ Dynamic restaurant listings and menus
- � Real-time order tracking
- 💳 Secure payment integration
- 🧾 Order history and receipts
- 🌍 Multilingual and mobile-responsive design

## 🛠️ Tech Stack

**Backend:**
- Laravel 11+
- REST API
- Laravel Sanctum (Authentication)

**Frontend:**
- React 19
- TypeScript
- Inertia.js
- Vite

**UI Components:**
- Tailwind CSS
- shadcn/ui
- Radix UI

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- MySQL/PostgreSQL
- Laravel CLI

### Installation

1. Clone the repository:
git clone https://github.com/yourusername/bonapp.git
cd bonapp

Install dependencies:
composer install
npm install
Configure environment:

cp .env.example .env
php artisan key:generate
Set up database:

php artisan migrate --seed
Start development servers:

npm run dev
php artisan serve
The app will be running at http://localhost:8000

📂 Project Structure
text
bonapp/
├── app/               # Laravel application core
├── bootstrap/
├── config/
├── database/          # Migrations and seeders
├── public/
├── resources/
│   ├── js/            # React components
│   ├── css/
│   └── views/
├── routes/
├── storage/
├── tests/
└── vite.config.js     # Vite configuration
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
Please read our Contribution Guidelines before submitting.

📜 License
Distributed under the MIT License. See LICENSE for more information.

📬 Contact
Romualdo SEBANY - romualdosebany.tech@gmail.com
Project Link: https://github.com/rsebany/bonapp
