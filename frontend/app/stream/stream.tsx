'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, ShieldCheck, Lock, Cpu, Link2Off, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ----------------------------------
   Active Stream Card Component
-----------------------------------*/
const StreamCard = ({ data, title, description, onSelect }: { data: any, title: string, description: string, onSelect: () => void }) => {
  if (!data) return <div className="h-[320px] animate-pulse bg-neutral-100 dark:bg-neutral-900/50 rounded-xl" />;
  const statusColors = {
    optimal: 'text-green-300 border-green-300/20',
    warning: 'text-yellow-400 border-yellow-400/20',
    critical: 'text-red-500 border-red-500/20',
  };

  return (
    <motion.div 
      onClick={onSelect}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer bg-white dark:bg-[#0A0A0A] border border-neutral-100 dark:border-neutral-900 p-6 rounded-xl hover:border-green-300 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-1">{title}</h3>
          <p className="text-[11px] text-neutral-500 max-w-[180px] leading-tight uppercase tracking-tighter">{description}</p>
        </div>
        <div className={`px-2 py-1 border rounded-md text-[10px] font-bold uppercase tracking-widest ${statusColors[data.status as keyof typeof statusColors]}`}>
          {data.status}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-black tracking-tighter tabular-nums">{data.currentUsage.toFixed(2)}</span>
        <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">W</span>
      </div>
      <div className="space-y-3 mb-6 text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
        <div className="flex justify-between"><span>Voltage</span><span>{data.voltage}V</span></div>
        <div className="flex justify-between"><span>Frequency</span><span>{data.frequency}Hz</span></div>
      </div>
      <div className="flex items-center justify-between mt-4 text-green-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black uppercase tracking-widest">Start Real-time Monitor</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

const DisabledStreamCard = () => (
    <div className="relative group bg-neutral-50/50 dark:bg-neutral-900/10 border border-dashed border-neutral-200 dark:border-neutral-800 p-6 rounded-xl overflow-hidden opacity-60">
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px] z-10" />
      <div className="relative z-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-2"><Lock className="w-3 h-3 text-neutral-400" /><h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-400">Hardware Node</h3></div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <Link2Off className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">🔒 Real-time Smart Plug</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-green-300/60">Coming Soon</span>
        </div>
      </div>
    </div>
);

export default function StreamPage() {
  const router = useRouter();
  const [streamData, setStreamData] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stream');
        const data = await res.json();
        setStreamData(data);
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMonitorInitiation = () => {
    setIsDeploying(true);
    setTimeout(() => {
      router.push(`/dashboard?id=${selectedStream.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto mb-16">
        <div className="flex items-center gap-3 mb-4 text-green-300 font-black uppercase tracking-[0.4em] text-[10px]">
          <div className="relative h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span></div>
          Neural Data Infrastructure
        </div>
        <h1 className="text-5xl lg:text-8xl font-black tracking-tightest uppercase leading-[0.85]">Live <br /> <span className="text-neutral-200 dark:text-neutral-800">Telemetry</span></h1>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {['normal_household', 'critical_fault', 'industrial_overuse', 'erratic_load'].map((id) => (
          <StreamCard 
            key={id}
            title={id.replace('_', ' ')} 
            description="Live Telemetry Stream"
            data={streamData.find(s => s.id === id)}
            onSelect={() => setSelectedStream(streamData.find(s => s.id === id))}
          />
        ))}
        <DisabledStreamCard />
      </div>

      <AnimatePresence>
        {selectedStream && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStream(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-neutral-100 dark:border-neutral-800 p-8 rounded-2xl">
              <button onClick={() => setSelectedStream(null)} className="absolute top-6 right-6 text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Initialize Real-time?</h2>
              <p className="text-neutral-500 text-[10px] mb-8 uppercase tracking-widest font-bold">Deploying Persistent Monitoring for: {selectedStream.id}</p>
              <button disabled={isDeploying} onClick={handleMonitorInitiation} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-green-300 dark:hover:bg-green-300 transition-colors">
                {isDeploying ? 'Establishing Neural Link...' : 'Confirm & Launch Dashboard'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}