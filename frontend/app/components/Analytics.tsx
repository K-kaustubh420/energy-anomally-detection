'use client'

import { useEffect, useState } from 'react'
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, AreaChart, Area, 
  ComposedChart, Scatter, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, Legend 
} from 'recharts'
import { motion } from 'framer-motion'
import { 
  BookOpen, ExternalLink, Activity, 
  Target, Database, BarChart2, CheckCircle, 
  Zap, Scale, Cpu, FileText
} from 'lucide-react'

// --- Types ---
interface ResearchPaper {
  id: number
  title: string
  author: string
  link: string
  tag: string
  abstract: string
  pros: string
  cons: string
  our_advantage: string
}

interface Data {
  metrics: {
    precision: number
    recall: number
    f1_score: number
    inference_time: number
    roc_auc: number
  }
  multivariate_stream: any[]
  confusion_matrix: number[][]
  roc_curve: any[]
  feature_importance: any[]
  radar_data: any[]
  research_comparison: ResearchPaper[]
}

// --- Sub-Components ---

const CitationLink = ({ title, author, link, tag }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group mb-2">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
        {tag}
      </span>
      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-400" />
    </div>
    <h4 className="text-xs font-bold text-gray-200 mt-2 leading-tight group-hover:text-cyan-100">{title}</h4>
    <p className="text-[10px] text-gray-500 mt-1 italic">{author}</p>
  </a>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f0f] border border-white/20 p-3 rounded shadow-xl backdrop-blur-md z-50">
        <p className="text-gray-500 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs font-mono mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
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

// --- NEW COMPONENT: RESEARCH COMPARISON ---
const ResearchComparisonSection = ({ papers, radarData }: { papers: ResearchPaper[], radarData: any[] }) => {
  return (
    <div className="mt-12 border-t border-white/10 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Scale className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Scientific Validation & Gap Analysis</h2>
          <p className="text-gray-400 text-sm">Benchmarking our Lightweight Isolation Forest against State-of-the-Art Literature</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 1. Radar Chart (Performance Trade-offs) */}
        <div className="xl:col-span-5 bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 flex flex-col justify-center">
          <h3 className="font-bold text-center mb-2 text-gray-200 flex items-center justify-center gap-2">
            <Activity size={16} className="text-cyan-400"/> Performance Trade-off
          </h3>
          <p className="text-center text-xs text-gray-500 mb-6">Visualizing the Efficiency vs. Accuracy Trade-off</p>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={110} data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                
                <Radar name="Our Model (IsoForest)" dataKey="OurModel" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.4} />
                <Radar name="Deep Learning (Pang et al.)" dataKey="DeepLearning" stroke="#f472b6" fill="#f472b6" fillOpacity={0.1} />
                <Radar name="Statistical Baseline" dataKey="Statistical" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Paper Comparisons (Detailed Cards) */}
        <div className="xl:col-span-7 space-y-4">
          {papers.map((paper) => (
            <div key={paper.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {paper.tag}
                    </span>
                    <a href={paper.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-cyan-400 transition-colors">
                      <ExternalLink size={10} /> Source Link
                    </a>
                  </div>
                  <h4 className="text-md font-bold text-gray-200 group-hover:text-cyan-100 transition-colors">{paper.title}</h4>
                  <p className="text-xs text-gray-500 italic">{paper.author}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-300 mb-4 leading-relaxed border-l-2 border-gray-600 font-serif italic">
                "{paper.abstract}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded bg-emerald-900/10 border border-emerald-500/10 text-emerald-400/90">
                  <span className="font-bold block mb-1 text-emerald-500 flex items-center gap-1"><CheckCircle size={10}/> STRENGTH</span>
                  {paper.pros}
                </div>
                <div className="p-3 rounded bg-red-900/10 border border-red-500/10 text-red-400/90">
                  <span className="font-bold block mb-1 text-red-500 flex items-center gap-1"><Activity size={10}/> LIMITATION</span>
                  {paper.cons}
                </div>
                <div className="p-3 rounded bg-cyan-900/10 border border-cyan-500/10 text-cyan-400/90 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1 opacity-10"><Zap size={40}/></div>
                  <span className="font-bold block mb-1 text-cyan-400 flex items-center gap-1"><Zap size={10}/> OUR SOLUTION</span>
                  {paper.our_advantage}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function AnalyticsAndMetrics() {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/api/modelevaluationmetrics')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load metrics", err))
  }, [])

  if (!data) return <div className="h-screen bg-[#050505] flex items-center justify-center text-cyan-500 font-mono animate-pulse">INITIALIZING ANALYTICS ENGINE...</div>

  return (
    <section className="min-h-screen bg-[#050505] text-white px-4 md:px-8 py-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto">
        
        {/* 1. HEADER */}
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
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4">
                Energy Anomaly Detection
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed border-l-2 border-cyan-500 pl-4">
                <strong className="text-white">Research Contribution:</strong> While Wang et al. focus on forecasting, 
                this framework provides <span className="text-cyan-400"> lightweight, real-time multivariate anomaly detection </span> 
                suitable for edge devices, directly addressing <strong className="text-amber-400">UN SDG 7.3</strong> (Energy Efficiency).
              </p>
            </div>
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-500 font-mono">PRECISION</p>
                <p className="text-3xl font-bold text-cyan-400">{data.metrics.precision}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-500 font-mono">LATENCY (Edge)</p>
                <p className="text-3xl font-bold text-amber-400">{data.metrics.inference_time}ms</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* 2. LEFT COLUMN: VISUALIZATIONS */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* A. MULTIVARIATE ANALYSIS */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-cyan-500" />
                    Multivariate Time-Series Analysis
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Correlation: Appliances (Wh) vs Environmental Context (T_out)</p>
                </div>
              </div>
              
              <div className="h-[400px] relative z-10">
                <ResponsiveContainer>
                  <ComposedChart data={data.multivariate_stream}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" stroke="#555" tick={false} label={{value: 'Time Step', position: 'insideBottom', offset: -5, fill:'#555', fontSize: 10}}/>
                    <YAxis yAxisId="left" stroke="#3b82f6" width={40} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 30]} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Line yAxisId="right" type="monotone" dataKey="T_out" stroke="#64748b" strokeWidth={1} dot={false} strokeDasharray="5 5" name="Outdoor Temp" />
                    <Area yAxisId="left" type="monotone" dataKey="Appliances" stroke="#3b82f6" fill="url(#colorEnergy)" name="Appliance Load" />
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
                <div className="grid grid-cols-2 gap-2 text-center h-[200px] content-center">
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col justify-center">
                      <span className="text-2xl font-bold text-emerald-400">{data.confusion_matrix[0][0]}</span>
                      <span className="text-[10px] uppercase text-emerald-200/50">True Neg</span>
                   </div>
                   <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex flex-col justify-center">
                      <span className="text-2xl font-bold text-red-400">{data.confusion_matrix[0][1]}</span>
                      <span className="text-[10px] uppercase text-red-200/50">False Pos</span>
                   </div>
                   <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex flex-col justify-center">
                      <span className="text-2xl font-bold text-red-400">{data.confusion_matrix[1][0]}</span>
                      <span className="text-[10px] uppercase text-red-200/50">False Neg</span>
                   </div>
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col justify-center">
                      <span className="text-2xl font-bold text-emerald-400">{data.confusion_matrix[1][1]}</span>
                      <span className="text-[10px] uppercase text-emerald-200/50">True Pos</span>
                   </div>
                </div>
              </div>

              {/* ROC Curve */}
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  ROC Analysis
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer>
                    <LineChart data={data.roc_curve}>
                      <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                      <XAxis dataKey="fpr" type="number" stroke="#555" tick={{fontSize:10}} />
                      <YAxis dataKey="tpr" type="number" stroke="#555" tick={{fontSize:10}} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine segment={[{x:0, y:0}, {x:1, y:1}]} stroke="#444" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="tpr" stroke="#f59e0b" strokeWidth={3} dot={false} name="Sensitivity" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: SIDEBAR */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* FEATURE IMPORTANCE */}
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400 flex items-center gap-2">
                <Cpu size={16} /> Feature Importance
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <BarChart layout="vertical" data={data.feature_importance}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" width={80} stroke="#666" tick={{fontSize: 10}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0,4,4,0]} barSize={20}>
                      {data.feature_importance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#1e293b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* UN SDG 7 CARD */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#e5243b] to-[#a01626] text-white shadow-lg relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <div className="flex justify-between items-start">
                   <div>
                        <h3 className="font-bold font-mono text-xs opacity-80 mb-1">UN SDG GOAL</h3>
                        <h2 className="text-4xl font-black mb-1">07</h2>
                   </div>
                   <Zap className="text-white/40" size={40} />
               </div>
               <p className="font-bold text-lg leading-tight mb-4 mt-2">AFFORDABLE AND CLEAN ENERGY</p>
               <div className="bg-black/20 p-3 rounded text-xs leading-relaxed backdrop-blur-sm border border-white/10">
                 Target 7.3: By 2030, double the global rate of improvement in energy efficiency.
               </div>
            </div>

             {/* QUICK CITATIONS */}
             <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-4">
                <h3 className="font-bold text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <FileText size={14}/> Quick References
                </h3>
                <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                   {data.research_comparison.map(p => (
                      <CitationLink key={p.id} title={p.title} author={p.author} tag={p.tag} link={p.link} />
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* 4. RESEARCH COMPARISON (Bottom Section) */}
        <ResearchComparisonSection papers={data.research_comparison} radarData={data.radar_data} />

      </div>
    </section>
  )
}