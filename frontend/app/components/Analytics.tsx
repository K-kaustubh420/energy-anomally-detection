'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line, AreaChart, Area,
  ComposedChart, Legend, Scatter, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine
} from 'recharts'
import { motion } from 'framer-motion'
import { 
  BookOpen, ExternalLink, Activity, Zap, 
  GitMerge, Target, Database, BarChart2, AlertTriangle, CheckCircle 
} from 'lucide-react'

// --- Types ---
interface Data {
  metrics: {
    precision: number
    recall: number
    f1_score: number
    inference_time: number
    roc_auc: number
  }
  multivariate_stream: any[]
  model_comparison: any[]
  feature_importance: any[]
  confusion_matrix: number[][]
  roc_curve: any[]
}

// --- Components ---

const CitationLink = ({ title, author, journal, link, tag }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
    <div className="flex justify-between items-start">
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${tag === 'BASELINE' ? 'bg-emerald-500/20 text-emerald-400' : tag === 'GAP' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
        {tag}
      </span>
      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-400" />
    </div>
    <h4 className="text-sm font-bold text-gray-200 mt-2 leading-tight group-hover:text-cyan-100">{title}</h4>
    <p className="text-xs text-gray-500 mt-1 italic">{author} • {journal}</p>
  </a>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f0f] border border-white/20 p-3 rounded shadow-xl backdrop-blur-md z-50">
        <p className="text-gray-500 text-xs mb-2 font-mono">Time Step: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs font-mono mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300 w-20">{entry.name}</span>
            <span className="text-white font-bold">
              {Number(entry.value).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsAndMetrics() {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/api/modelevaluationmetrics')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div className="h-screen bg-[#050505] flex items-center justify-center text-cyan-500 font-mono">INITIALIZING ANALYTICS ENGINE...</div>

  return (
    <section className="min-h-screen bg-[#050505] text-white px-4 md:px-8 py-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto">
        
        {/* 1. HEADER: PROJECT IDENTITY */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6"
          >
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle size={12}/> Baseline Model: Isolation Forest
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
                  <Database size={12}/> UCI Appliances Dataset
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black bg-linear-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4">
                Energy Anomaly Detection
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed border-l-2 border-cyan-500 pl-4">
                <strong className="text-white">Research Contribution:</strong> Existing systems focus on load forecasting 
                (Wang et al.) or grid-level optimization. This project fills the gap by providing a 
                <span className="text-cyan-400"> lightweight, real-time, multivariate anomaly detection framework </span> 
                specifically for smart-home consumption, aligning with <strong className="text-amber-400">UN SDG 7</strong>.
              </p>
            </div>
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 font-mono">PRECISION (Low False Positives)</p>
                <p className="text-3xl font-bold text-cyan-400">{data.metrics.precision}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 font-mono">INFERENCE LATENCY</p>
                <p className="text-3xl font-bold text-amber-400">{data.metrics.inference_time}ms</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* 2. LEFT COLUMN: VISUALIZATIONS (8 Cols) */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* A. MULTIVARIATE ANALYSIS (The Core Proof) */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-cyan-500" />
                    Multivariate Time-Series Analysis
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Correlation: Appliances (Wh) vs Environmental Context (T_out)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Energy</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Anomaly</span>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer>
                  <ComposedChart data={data.multivariate_stream}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" stroke="#555" tick={false} label={{value: 'Time Step (10 min intervals)', position: 'insideBottom', offset: -5, fill:'#555', fontSize: 10}}/>
                    <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Consumption (Wh)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 30]} label={{ value: 'T_out (°C)', angle: 90, position: 'insideRight', fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Context Line (Temp) */}
                    <Line yAxisId="right" type="monotone" dataKey="T_out" stroke="#64748b" strokeWidth={1} dot={false} strokeDasharray="5 5" name="Outdoor Temp" />
                    
                    {/* Main Metric (Energy) */}
                    <Area yAxisId="left" type="monotone" dataKey="Appliances" stroke="#3b82f6" fill="url(#colorEnergy)" name="Appliance Load" />
                    
                    {/* Anomalies (Scatter) */}
                    <Scatter yAxisId="left" dataKey="isAnomaly" fill="#ef4444" stroke="#fff" strokeWidth={2} r={6} name="Anomaly Detected" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* B. EVALUATION METRICS GRID */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Confusion Matrix */}
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Confusion Matrix
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center h-[250px] content-center">
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col justify-center">
                      <span className="text-3xl font-bold text-emerald-400">{data.confusion_matrix[0][0]}</span>
                      <span className="text-[10px] uppercase text-emerald-200/50">True Negative (Normal)</span>
                   </div>
                   <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex flex-col justify-center">
                      <span className="text-3xl font-bold text-red-400">{data.confusion_matrix[0][1]}</span>
                      <span className="text-[10px] uppercase text-red-200/50">False Positive</span>
                   </div>
                   <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex flex-col justify-center">
                      <span className="text-3xl font-bold text-red-400">{data.confusion_matrix[1][0]}</span>
                      <span className="text-[10px] uppercase text-red-200/50">False Negative</span>
                   </div>
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col justify-center">
                      <span className="text-3xl font-bold text-emerald-400">{data.confusion_matrix[1][1]}</span>
                      <span className="text-[10px] uppercase text-emerald-200/50">True Positive (Anomaly)</span>
                   </div>
                </div>
              </div>

              {/* ROC Curve */}
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-amber-400" />
                  ROC Curve
                </h3>
                <div className="h-[250px]">
                  <ResponsiveContainer>
                    <LineChart data={data.roc_curve}>
                      <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                      <XAxis dataKey="fpr" type="number" stroke="#555" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#555', fontSize: 10 }} />
                      <YAxis dataKey="tpr" type="number" stroke="#555" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#555', fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine segment={[{x:0, y:0}, {x:1, y:1}]} stroke="#444" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="tpr" stroke="#f59e0b" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* C. COMPARATIVE STUDY */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" />
                Model Comparison (Research Justification)
              </h3>
              <p className="text-xs text-gray-500 mb-6">Why Isolation Forest? High capability with minimal computational cost.</p>
              
              <div className="h-[200px]">
                <ResponsiveContainer>
                   <BarChart layout="vertical" data={data.model_comparison} barCategoryGap="20%">
                     <CartesianGrid stroke="#222" horizontal={false} />
                     <XAxis type="number" stroke="#555" domain={[0, 100]} />
                     <YAxis dataKey="name" type="category" stroke="#888" width={140} tick={{fontSize: 11}} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="speed" name="Inference Speed" fill="#10b981" radius={[0,4,4,0]} barSize={10} />
                     <Bar dataKey="capability" name="Detection Capability" fill="#3b82f6" radius={[0,4,4,0]} barSize={10} />
                   </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 3. RIGHT COLUMN: LITERATURE & REFERENCES (4 Cols) */}
          <div className="xl:col-span-4 space-y-6">

            {/* A. FEATURE IMPORTANCE (Proof of UCI Dataset) */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">UCI Dataset Features</h3>
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <BarChart layout="vertical" data={data.feature_importance}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" width={120} stroke="#666" tick={{fontSize: 10}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0,4,4,0]} barSize={15}>
                      {data.feature_importance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#1e293b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* B. CITATIONS (Interactive) */}
            <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/2">
                <h3 className="font-bold flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  Core Literature
                </h3>
              </div>
              
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. BASELINE */}
                <CitationLink 
                  tag="BASELINE"
                  title="Isolation Forest"
                  author="F. T. Liu, K. M. Ting and Z. -H. Zhou"
                  journal="IEEE International Conference on Data Mining, 2008"
                  link="https://ieeexplore.ieee.org/document/4781136"
                />

                {/* 2. GAP / CONTEXT */}
                <CitationLink 
                  tag="CONTEXT"
                  title="Short-Term Load Forecasting Using Machine Learning"
                  author="T. Oreski"
                  journal="IEEE 41st MIPRO, 2018"
                  link="https://ieeexplore.ieee.org/document/8467047"
                />
                 <p className="text-[10px] text-gray-500 px-2">
                   *Justification:* Most papers (like Oreski) focus on forecasting. We focus on <span className="text-white">anomaly detection</span>.
                 </p>

                <CitationLink 
                  tag="CONTEXT"
                  title="Anomaly Detection in Smart Meter Data"
                  author="J. P. McLaughlin et al."
                  journal="IEEE Global Conference on Signal, 2018"
                  link="https://ieeexplore.ieee.org/document/8587555"
                />

                {/* 3. FUTURE / MULTIVARIATE */}
                <CitationLink 
                  tag="FUTURE"
                  title="Multivariate Time-Series Anomaly Detection"
                  author="R. Chalapathy et al."
                  journal="IEEE Access, 2019"
                  link="https://ieeexplore.ieee.org/document/9069946"
                />
                
                <CitationLink 
                  tag="FUTURE"
                  title="LSTM-Based Anomaly Detection for Time Series"
                  author="T. K. Tran et al."
                  journal="IEEE Symposium on Series, 2019"
                  link="https://ieeexplore.ieee.org/document/8948477"
                />

              </div>
            </div>

            {/* C. UN SDG 7 CARD */}
            <div className="p-6 rounded-2xl bg-linear-to-br from-[#e5243b] to-[#a01626] text-white">
               <h3 className="font-bold font-mono text-sm opacity-80 mb-2">SUSTAINABLE DEVELOPMENT GOAL</h3>
               <h2 className="text-3xl font-black mb-2">07</h2>
               <p className="font-bold text-lg leading-tight mb-4">AFFORDABLE AND CLEAN ENERGY</p>
               <div className="bg-black/20 p-3 rounded text-xs leading-relaxed">
                 Target 7.3: By 2030, double the global rate of improvement in energy efficiency.
               </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}