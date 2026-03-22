<div align="center">
  <img src="./Frontend/assets/logo.svg" alt="Wallex Logo" width="120" />
  <h1>Wallex - Enterprise Student Finance Manager</h1>
  <p><strong>Intelligent AI-driven financial management engineered with enterprise-grade React, Node.js, and Google Gemini.</strong></p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://wallex-opal.vercel.app/)
  [![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://wallex-backend-iscu.onrender.com)
  [![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini-blue?style=for-the-badge)](#)
</div>

<br />

Wallex is a comprehensive, mobile-first financial management platform designed specifically for college students. Moving beyond simple budgeting, Wallex utilizes the **Google Gemini Generative AI Model** to automatically parse, classify, and intelligently categorize transaction descriptions with high precision.

*This project was engineered adopting strict Silicon Valley industry standards, including Test-Driven Development (TDD) via Vitest, aggressive stateless abstraction, zero-trust HttpOnly cookie architectures, and strict TS typings.*

---

## ✨ Enterprise Technical Highlights

- **Generative AI Microservice Integration**: Replaced heavy traditional ML-Service architectures by directly binding the Node.js routing layer with `@google/genai`, achieving ~400ms transaction classification times.
- **Custom Global State Abstraction**: Developed `useApi()`, an aggressive custom React hook mimicking *React Query/SWR* that globally manages `loading`, `error`, and `data` network lifecycles, eliminating hundreds of lines of brittle `<useEffect>` boilerplate.
- **Enterprise Security (Zero-Trust Auth)**: Eradicated XSS vulnerabilities by completely stripping JSON Web Tokens out of `localStorage`. Built a robust authentication interception layer utilizing Node.js `cookie-parser` and Axios `withCredentials: true` to exclusively handle `HttpOnly` secure cookies.
- **Type-Safe Domain Modeling**: Eliminated `any` compiler warnings via strict, centralized explicit interfaces (`Frontend/types/index.ts`) that strictly mirror the MongoDB NoSQL Mongoose Schemas.
- **Automated Testing Suite**: Wired up `Vitest` with `jsdom` and React Testing Library to unit test core math algorithms, ensuring float-division precision and zero-divide crashes on financial charting logic.
- **Ultra-Premium UI/UX**: Designed a heavily animated, natively fluid mobile-first iOS-style bottom floating tab bar, relying heavily on `framer-motion` staggered views, custom Bento-grid metric cards, and heavy glassmorphism/backdrop blurs.

---

## 🏗️ Core Architecture & Stack

### Frontend (User Interface)
- **Framework**: React 18 + Vite
- **Language**: Strict TypeScript
- **Styling**: Vanilla CSS + Tailwind CSS (Bento-grid mechanics)
- **Animation**: Framer Motion (Hardware-accelerated layout transitions)
- **Testing**: Vitest + @testing-library/react

### Backend (REST API)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas + Mongoose ORM
- **Intelligence**: Google Gemini (via `@google/genai`)
- **Validation**: Zod (Enforced request-body shape checking)

---

## 🎮 Live Application Access

You can explore the live application at: **[wallex-opal.vercel.app](https://wallex-opal.vercel.app/)**

### Demo Accounts
The system is seeded with multiple distinct persona profiles demonstrating specialized feature flags.
> **Universal OTP Password:** `123456`

- **Aisha Patel** (`aisha@example.com`) - *High Earner Profile* (Shows Investment recommendations & volatility)
- **Meera Singh** (`meera@example.com`) - *Budget Conscious Profile* (Shows Spending alerts & optimizations)
- **Farida Ahmed** (`farida@example.com`) - *Parent Portal View* (Tracks Aisha's linked allowance requests)

---

## 💻 Local Development Setup

To run this application locally on your machine, follow these steps:

### 1. Requirements
Ensure you have Node.js installed on your machine and a free [Google AI Studio](https://aistudio.google.com/app/apikey) API Key.

### 2. Backend Initialization
```bash
git clone https://github.com/utsavukani/wallex.git
cd wallex/backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/wallex
JWT_SECRET=development_secret_key_123
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
CORS_ORIGIN=http://localhost:5173
```
```bash
npm start
```

### 3. Frontend Initialization
In a new terminal wrapper:
```bash
cd wallex/Frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 🔒 Security Posture & Hardening

1. **HttpOnly Cookies**: JWTs are strictly passed via headers unavailable to DOM JavaScript execution.
2. **Helmet.js Headers**: Protects the API against clickjacking and sniffing.
3. **CORS Explicit Whitelisting**: Strict origin rejection.
4. **Zod Parsing**: Impossible to crash the API via malformed JSON payloads due to runtime schema validation.

---

## 📝 License
This project is open source and available under the standard MIT License.
