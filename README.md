## live link ==https://tradelens1.onrender.com/
## ✨ Features

* 📊 Interactive TradingView Lightweight Charts
* 🕯️ Candlestick chart visualization
* 📈 Volume chart support
* 🔍 Search stocks by symbol
* 📅 Timeframe filtering (1W, 1M, 3M, 6M, 1Y, ALL)
* ⚡ Smooth GSAP animations
* 📊 Statistics dashboard

---
## 📂 Data Sources
This project supports **two ways** of loading stock market data:
### 1. Alpha Vantage API (Recommended)
The application can fetch historical stock market data directly from the **Alpha Vantage API**, allowing users to visualize up-to-date market information.

Example API:

```
https://www.alphavantage.co/query
```

An API key is required and is stored in the `.env` file.

---

### 2. Local File Upload

Users can also upload their own historical stock data in **CSV format**.

The uploaded file should contain OHLCV data with columns similar to:

```
Date
Open
High
Low
Close
Volume
```

This allows the application to visualize custom datasets without relying on an internet connection.

---

## 🛠️ Tech Stack

* React (Vite)
* JavaScript 
* TradingView Lightweight Charts
* GSAP
* React Icons

---

## 📦 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd <repository-name>
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the **root directory** of the project.

Add your Alpha Vantage API key:

```env
ALPHA_VANTAGE_API_KEY=YOUR_API_KEY
```

> **Note:** If your existing `.env` uses `ALPHA_VANTAGE_API_KEY=...`, update it to `VITE_ALPHA_VANTAGE_API_KEY=...` so Vite can expose it to the frontend via `import.meta.env`.

---

## ▶️ Running the Project Locally

Start the development server:

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

---

## 📊 Supported Dataset Format

The application expects stock market data in OHLCV format.

Example:

```json
{
  "time": "2025-01-15",
  "open": 201.25,
  "high": 205.80,
  "low": 199.60,
  "close": 204.10,
  "volume": 32547891
}
```

or CSV:

```
Date,Open,High,Low,Close,Volume
2025-01-15,201.25,205.80,199.60,204.10,32547891
```

