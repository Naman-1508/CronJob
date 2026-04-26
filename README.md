# ⚡ CronPulse

**CronPulse** is a lightweight, serverless heartbeat monitor designed to keep Render free-tier backends active 24/7. It bypasses the 15-minute inactivity spin-down by sending automated, high-frequency "heartbeats" via Upstash QStash and Vercel.

![CronPulse Dashboard](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

---

## 🚀 Key Features

- **Automated Heartbeats**: Never let your Render server sleep again.
- **Serverless Architecture**: 100% cloud-native using Vercel Functions.
- **QStash Integration**: High-frequency scheduling (every 5-10 mins) for free.
- **Glassmorphic UI**: Premium dashboard to monitor ping logs and status.
- **Secure API**: Protected by `CRON_SECRET` to prevent unauthorized pings.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS 4, Framer Motion.
- **Backend**: Next.js App Router (Serverless Functions).
- **Automation**: Upstash QStash.
- **Icons**: Lucide React.

---

## 🏁 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/pulse-monitor.git
cd pulse-monitor
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
RENDER_URL=https://your-app.onrender.com
QSTASH_TOKEN=your_upstash_token
CRON_SECRET=your_secure_password
```

### 3. Deploy to Vercel
Push your code to GitHub and connect it to Vercel. Ensure you add the environment variables above in the Vercel Dashboard.

---

## 🤖 Automation Setup (Upstash QStash)

Since Vercel Hobby limits cron jobs to once per day, follow these steps for 24/7 pings:

1. Create a free account at [Upstash](https://console.upstash.com/).
2. In the **QStash** tab, create a new **Schedule**.
3. Set **Destination** to `https://your-vercel-url.com/api/ping`.
4. Set **Cron** to `*/10 * * * *` (Every 10 minutes).
5. Add a **Forward Header**:
   - **Key**: `Authorization`
   - **Value**: `Bearer your_cron_secret`
6. Click **Schedule**.

---

## 🛡️ Security
The API endpoint `/api/ping` is protected. Any request without the correct `Authorization` header will receive a `401 Unauthorized` response, preventing abuse of your serverless resources.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the developer community.
</p>
