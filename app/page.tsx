"use client";

import { useState, useEffect } from "react";
import { Activity, Globe, Shield, Zap, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Code, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [renderUrl, setRenderUrl] = useState("");
  const [cronSecret, setCronSecret] = useState("");
  const [lastPing, setLastPing] = useState<{ time: string; duration: string; status: number } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("pulse_render_url");
    const savedSecret = localStorage.getItem("pulse_cron_secret");
    if (savedUrl) setRenderUrl(savedUrl);
    if (savedSecret) setCronSecret(savedSecret);
  }, []);

  const saveUrl = (url: string) => {
    setRenderUrl(url);
    localStorage.setItem("pulse_render_url", url);
  };

  const saveSecret = (secret: string) => {
    setCronSecret(secret);
    localStorage.setItem("pulse_cron_secret", secret);
  };

  const triggerPing = async () => {
    if (!renderUrl) return;
    
    setStatus("loading");
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Initiating manual pulse...`, ...prev]);

    try {
      const res = await fetch("/api/ping", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cronSecret}`
        },
      });
      
      const data = await res.json().catch(() => ({ success: false, error: "Invalid response from server" }));
      
      if (data.success) {
        setStatus("success");
        setLastPing({
          time: new Date().toLocaleTimeString(),
          duration: data.duration,
          status: data.status
        });
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Pulse Successful (${data.duration})`, ...prev]);
      } else {
        setStatus("error");
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Pulse Failed: ${data.error || "Unauthorized"}`, ...prev]);
      }
    } catch (err: any) {
      setStatus("error");
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Error: ${err.message}`, ...prev]);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-24">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <Activity className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                CronPulse
              </h1>
            </motion.div>
            <p className="text-gray-400 text-lg">Serverless heartbeat monitor for Render backends.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-medium transition-all duration-500 ${
              status === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
              status === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
              "bg-white/5 border-white/10 text-gray-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                status === "success" ? "bg-emerald-400 animate-pulse" :
                status === "error" ? "bg-rose-400" :
                "bg-gray-400"
              }`} />
              {status === "success" ? "System Active" : status === "error" ? "Pulse Failed" : "Standby"}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Manual Pulse
                </h2>

                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Target Render URL</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="https://your-app.onrender.com"
                        value={renderUrl}
                        onChange={(e) => saveUrl(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Cron Secret (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="password" 
                        placeholder="Your CRON_SECRET"
                        value={cronSecret}
                        onChange={(e) => saveSecret(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-200 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={triggerPing}
                    disabled={status === "loading" || !renderUrl}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
                  >
                    {status === "loading" ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Trigger Heartbeat
                        <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Last Response</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {lastPing ? `${lastPing.duration}` : "--"}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Last Ping Time</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {lastPing ? lastPing.time : "--:--:--"}
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 h-64 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Activity Logs
                </h3>
                <button 
                  onClick={() => setLogs([])}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1 custom-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-gray-600 italic">No activity yet...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className={log.includes("Successful") ? "text-emerald-400/80" : log.includes("Error") || log.includes("Failed") ? "text-rose-400/80" : "text-gray-500"}>
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-300">
                <Shield className="w-5 h-5" />
                24/7 Automation
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Render free tier sleeps after 15 mins. Use QStash to automate this.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Get QSTASH_TOKEN from console",
                  "Add URL to QStash Scheduler",
                  "Include Authorization header",
                  "Set Interval to 10 Minutes"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold border border-indigo-500/30">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>

              <a 
                href="https://console.upstash.com/qstash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                Upstash Console
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
