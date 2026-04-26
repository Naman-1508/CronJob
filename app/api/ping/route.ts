import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Optional: Verify signature if you want maximum security
  // For now, we'll use a simple secret check or just let it run
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const RENDER_URL = process.env.RENDER_URL;

  if (!RENDER_URL) {
    return NextResponse.json({ error: "RENDER_URL not configured" }, { status: 500 });
  }

  try {
    console.log(`[Pulse] Hitting Render backend: ${RENDER_URL}`);
    const start = Date.now();
    const response = await fetch(RENDER_URL, {
      method: "GET",
      headers: {
        "User-Agent": "CronPulse-Monitor/1.0",
      },
      cache: "no-store",
    });

    const duration = Date.now() - start;

    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: response.status,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        status: response.status,
        error: response.statusText,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }, { status: 200 }); // Still return 200 to QStash so it doesn't retry infinitely if the backend is just "down"
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  }
}

// Allow GET for manual testing
export async function GET(req: NextRequest) {
    return POST(req);
}
