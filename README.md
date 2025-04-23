# 💰 My-Wallet — A Smarter Way to Track Finances

Welcome to **My-Wallet**, a full-stack personal finance management app that helps you take control of your income and expenses with insightful analytics, a clean UI, and smooth user experience.

---

## 🔗 Live Links

- 🖥️ **Frontend (React):** [https://my-wallet-frontend-liard.vercel.app](https://my-wallet-frontend-liard.vercel.app)
- 🔐 **Backend (API):** [https://my-wallet-gamma-eight.vercel.app](https://my-wallet-gamma-eight.vercel.app)

---

## 🧠 Features

- ✨ Google and Email/Password Authentication (JWT + Passport)
- 🍪 Secure Cookie-based Sessions
- 📊 Income & Expense Tracking by Category/Subcategory
- 📅 Date Range Filters with Smart Dashboards
- 📁 Separate Views for Transactions, Categories & Analytics
- 🔐 Token Verification Middleware
- ☁️ MongoDB Integration for Persistent Data

---

## 🧾 Project Structure

```
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── utils
│   └── views
├── views
│   ├── components
│   ├── context
│   ├── pages
│   ├── routes
│   ├── services
│   ├── utils
│   └── views
└── public
```

🚀 Getting Started Locally

1. Clone the Repository

```
git clone https://github.com/your-username/my-wallet.git
cd my-wallet
```

2. Install Dependencies

# Frontend dependencies

npm install

# Backend dependencies

cd server
npm install

3. Setup Environment Variables
   Create a .env file in the server folder and copy contents from .env.example. Update values like:

- PORT
- mongoURL
- secretKey
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SESSION_SECRET
- NODE_ENV
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

4. Run the App Locally

# Start backend (inside server/)

cd server
npm run dev

# In a separate terminal, start frontend

cd ../
npm run dev

Frontend runs at: http://localhost:3000

Backend runs at: http://localhost:8080

Both frontend and backend share the same command: npm run dev

🔐 Authentication & Cookies
Login sessions are handled via JWT in HTTP-only cookies

Cookie settings:

httpOnly: true

sameSite: None

secure: true (in production)

Ensure you're using credentials: 'include' on frontend fetch requests

⚙️ Tech Stack

Layer Tech Stack
Frontend React, Tailwind CSS, Recharts
Backend Node.js, Express.js
Database MongoDB (Mongoose ORM)
Auth Passport.js, JWT
Hosting Vercel (for both frontend & backend)
✨ Credits
Built with 💻, caffeine ☕, and lots of ❤️ by Vikram and team.

📬 Feedback or Suggestions?
Open an issue or pull request on GitHub. We’d love to improve this with yo
