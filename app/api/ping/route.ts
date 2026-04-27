import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // 1. Check if Secret is configured in Vercel
  if (!cronSecret) {
    return NextResponse.json({ 
      success: false, 
      error: "CRON_SECRET is not set in environment variables." 
    }, { status: 500 });
  }

  // 2. Validate the Secret
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ 
      success: false, 
      error: "Invalid Secret. Check your CRON_SECRET." 
    }, { status: 401 });
  }

  const RENDER_URLS = process.env.RENDER_URL?.split(",").map(url => url.trim()).filter(Boolean) || [];

  if (RENDER_URLS.length === 0) {
    return NextResponse.json({ 
      success: false, 
      error: "RENDER_URL is not configured." 
    }, { status: 500 });
  }

  try {
    const results = await Promise.all(RENDER_URLS.map(async (url) => {
      const start = Date.now();
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "User-Agent": "CronPulse-Monitor/1.0" },
          cache: "no-store",
        });
        const duration = Date.now() - start;
        return {
          url,
          success: response.ok,
          status: response.status,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          error: response.ok ? null : `Backend returned ${response.status}: ${response.statusText}`
        };
      } catch (error: any) {
        return {
          url,
          success: false,
          error: `Fetch Error: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
    }));

    const allSuccessful = results.every(r => r.success);

    return NextResponse.json({
      success: allSuccessful,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Unexpected Error: ${error.message}`,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    return POST(req);
}
