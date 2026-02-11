'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle, ArrowLeft, Timer, BarChart3, Zap, BrainCircuit, X } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const streamId = searchParams.get('id');

  const [currentKW, setCurrentKW] = useState<number>(0);
  const [prediction, setPrediction] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // --- NEW DIAGNOSTIC STATES ---
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [windowBuffer, setWindowBuffer] = useState<number[]>([]);
  const [finalReport, setFinalReport] = useState<any>(null);
  const DIAGNOSTIC_LIMIT = 30; // 30 seconds for a quick demo

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      try {
        const streamRes = await fetch('/api/stream');
        const streams = await streamRes.json();
        const activeStream = streams.find((s: any) => s.id === streamId);
        const val = Math.round(activeStream?.currentUsage || 0);
        setCurrentKW(val);

        const predictRes = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ energy: val })
        });
        const predData = await predictRes.json();
        const isAnomaly = predData.status === 'ANOMALY';
        
        setPrediction(predData);
        setHistory(prev => [{ val, is_anomaly: isAnomaly, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        
        // BUFFERING FOR ANALYSIS
        if (isDiagnosticMode) {
            setWindowBuffer(prev => [...prev, val]);
        }

        setSecondsElapsed(prev => prev + 2);

      } catch (e) { console.error(e); }
    }, 2000); 

    return () => clearInterval(interval);
  }, [streamId, isMonitoring, isDiagnosticMode]);

  // TRIGGER FINAL ANALYSIS
  useEffect(() => {
    if (windowBuffer.length >= (DIAGNOSTIC_LIMIT / 2)) {
        handleFinalAnalysis();
    }
  }, [windowBuffer]);

  const handleFinalAnalysis = async () => {
    setIsMonitoring(false);
    setIsDiagnosticMode(false);
    try {
        const res = await fetch('http://localhost:8000/analyze-window', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ readings: windowBuffer })
        });
        const report = await res.json();
        setFinalReport(report);
    } catch (e) { console.error(e); }
  };

  const anomaliesCount = history.filter(h => h.is_anomaly).length;
  const currentIsAnomaly = prediction?.status === 'ANOMALY';

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <Link href="/stream" className="flex items-center gap-2 text-neutral-500 hover:text-green-300 mb-6 group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                </Link>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tightest uppercase leading-none">Monitor</h1>
                <p className="text-neutral-500 uppercase tracking-widest text-[11px] font-bold mt-4">Node: {streamId} // Persistence Mode</p>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        setIsDiagnosticMode(true);
                        setWindowBuffer([]);
                    }}
                    disabled={isDiagnosticMode}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${isDiagnosticMode ? 'border-green-300 bg-green-300/10 text-green-300' : 'border-neutral-800 hover:border-green-300 text-neutral-400'}`}
                >
                    <BrainCircuit className={`w-4 h-4 ${isDiagnosticMode ? 'animate-pulse' : ''}`} />
                    {isDiagnosticMode ? `Analyzing Buffer (${windowBuffer.length}/${DIAGNOSTIC_LIMIT/2})` : 'Start System Diagnostic'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-900/40 p-10 rounded-3xl border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-12 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-300" /> Current Neural Input
                    </h3>
                    <motion.div 
                        key={currentKW} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                        className="text-8xl font-black tracking-tighter tabular-nums flex items-baseline gap-4"
                    >
                        {currentKW} <span className="text-2xl text-neutral-500 uppercase tracking-widest">W</span>
                    </motion.div>
                </div>
                <AnimatePresence>
                    {currentIsAnomaly && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-600 animate-pulse" />
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-white dark:bg-neutral-900/20 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-900">
                <h3 className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Real-time Analytics
                </h3>
                <div className="grid grid-cols-3 gap-8">
                    <div><p className="text-[9px] text-neutral-500 uppercase font-black mb-1">Anomalies</p><p className={`text-2xl font-black ${anomaliesCount > 0 ? 'text-red-500' : 'text-green-300'}`}>{anomaliesCount}</p></div>
                    <div><p className="text-[9px] text-neutral-500 uppercase font-black mb-1">Session Avg</p><p className="text-2xl font-black">{(history.reduce((a, b) => a + b.val, 0) / (history.length || 1)).toFixed(0)} W</p></div>
                    <div><p className="text-[9px] text-neutral-500 uppercase font-black mb-1">Status</p><p className={`text-2xl font-black ${currentIsAnomaly ? 'text-red-500' : 'text-green-300'}`}>{currentIsAnomaly ? 'ALERT' : 'SAFE'}</p></div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0A0A0A] border border-neutral-900 p-8 rounded-3xl flex flex-col h-[500px]">
            <h3 className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-8 flex justify-between">
                <span>Inference Stream</span>
                <span className="text-green-300 animate-pulse">LIVE_FEED</span>
            </h3>
            <div className="space-y-3 font-mono overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {history.map((log, i) => (
                        <motion.div key={log.time + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between items-center p-3 rounded-lg border ${log.is_anomaly ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'}`}>
                            <span className="text-[10px] font-bold">[{log.time}]</span>
                            <span className="text-[11px] font-black uppercase tracking-tighter">VAL: {log.val} W // {log.is_anomaly ? 'ANOMALY' : 'NORMAL'}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
          </div>
        </div>

        {/* FINAL ANALYTICS MODAL */}
        <AnimatePresence>
          {finalReport && (
            <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFinalReport(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-[#050505] border border-neutral-800 p-12 rounded-3xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-300" />
                    <button onClick={() => {setFinalReport(null); setIsMonitoring(true);}} className="absolute top-8 right-8 text-neutral-500 hover:text-white"><X /></button>
                    
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Neural Diagnostic Result</h2>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12">Temporal window analysis complete</p>

                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2">Anomaly Concentration</p>
                            <p className="text-4xl font-black text-green-300 tabular-nums">{finalReport.anomaly_ratio}%</p>
                        </div>
                        <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2">Peak Load Recorded</p>
                            <p className="text-4xl font-black text-white tabular-nums">{finalReport.max_load} W</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">System Diagnostic</h4>
                            <p className="text-xl font-bold text-white">{finalReport.diagnostic}</p>
                        </div>
                        <div className="p-6 bg-green-300/10 rounded-2xl border border-green-300/20">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-green-300 mb-2">Recommended Action</h4>
                            <p className="text-sm text-green-300/90 leading-relaxed italic">"{finalReport.recommendation}"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}