import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // 1. Check if Secret is configured in Vercel
  if (!cronSecret) {
    return NextResponse.json({ 
      success: false, 
      error: "CRON_SECRET is not set in Vercel environment variables." 
    }, { status: 500 });
  }

  // 2. Validate the Secret
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ 
      success: false, 
      error: "Invalid Secret. Check your CRON_SECRET." 
    }, { status: 401 });
  }

  const RENDER_URL = process.env.RENDER_URL;

  if (!RENDER_URL) {
    return NextResponse.json({ 
      success: false, 
      error: "RENDER_URL is not configured in Vercel." 
    }, { status: 500 });
  }

  try {
    const start = Date.now();
    const response = await fetch(RENDER_URL, {
      method: "GET",
      headers: { "User-Agent": "CronPulse-Monitor/1.0" },
      cache: "no-store",
    });

    const duration = Date.now() - start;

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      error: response.ok ? null : `Backend returned ${response.status}: ${response.statusText}`
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Fetch Error: ${error.message}`,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  }
}

export async function GET(req: NextRequest) {
    return POST(req);
}
