# 🚀 CronPulse Deployment Guide

Follow these steps to deploy your 24/7 Render keep-alive monitor on Vercel using Upstash QStash.

## 1. Deploy to Vercel

1.  **Push to GitHub**: Push this code to a new repository on your GitHub account.
2.  **Connect to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New** > **Project**.
    *   Import your repository.
3.  **Configure Environment Variables**:
    In the Vercel project settings, add the following variables:
    *   `RENDER_URL`: Your backend URL (e.g., `https://my-api.render.com`).
    *   `QSTASH_TOKEN`: (Get this in the next step).
    *   `CRON_SECRET`: A random string of your choice (e.g., `mysecret123`).
4.  **Deploy**: Click **Deploy**.

---

## 2. Setup Upstash QStash (Automated Pings)

Since Vercel Hobby limits cron jobs to once per day, we use **Upstash** to hit our API every 10 minutes.

1.  **Create Account**: Sign up for a free account at [Upstash](https://console.upstash.com/).
2.  **Get Token**: 
    *   Go to the **QStash** tab.
    *   Copy the `QSTASH_TOKEN` and add it to your Vercel Environment Variables.
3.  **Schedule the Ping**:
    *   In the QStash Console, go to **Schedules**.
    *   Click **Create Schedule**.
    *   **Destination URL**: `https://your-vercel-app.vercel.app/api/ping`
    *   **Cron Expression**: `*/10 * * * *` (This means every 10 minutes).
    *   **Forward Headers**: 
        *   Add `Authorization`: `Bearer your_cron_secret_here` (matching what you put in Vercel).
    *   Click **Create**.

---

## 3. Verify it's Working

1.  **Open your Vercel URL**: You should see your new beautiful dashboard.
2.  **Manual Test**: Enter your URL in the dashboard and click **Trigger Heartbeat**.
3.  **Check QStash Logs**: In the Upstash console, check the **Logs** tab to see the automated pings happening every 10 minutes.

### 💡 Why this works
By using QStash to hit your Vercel API, and your Vercel API to hit Render, you create a "Serverless Chain" that never sleeps. Render will see traffic every 10 minutes and will never enter the "Inactivity" spin-down state.
