'use client'

import { useEffect, useState } from 'react'
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend, ScatterChart, Scatter, ZAxis, BarChart, Bar, Cell, ReferenceLine
} from 'recharts'
import { motion } from 'framer-motion'
import { Award, TrendingDown, Zap, ShieldCheck, AlertTriangle, Info } from 'lucide-react'

// --- Types ---
interface BeeData {
  driftData: any[]
  radarData: any[]
  scatterData: any[]
  consumptionData: any[]
  bee_standards: any
}

// --- Custom Components ---

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 bg-black/40 p-2 rounded-lg border border-white/10">
    {[1, 2, 3, 4, 5].map((star) => (
      <Award 
        key={star} 
        size={16} 
        className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
      />
    ))}
    <span className="ml-2 text-xs font-mono text-yellow-500">{rating}-STAR BEE</span>
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/20 p-3 rounded shadow-xl backdrop-blur-md z-50">
        <p className="text-gray-400 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs font-mono mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-bold">
              {Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Comparison() {
  const [data, setData] = useState<BeeData | null>(null)

  useEffect(() => {
    fetch('/api/bee-comparison')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err))
  }, [])

  if (!data) return <div className="p-12 text-center text-cyan-500 font-mono animate-pulse">LOADING STANDARDS...</div>

  return (
    <section className="min-h-screen bg-[#050505] text-white px-4 md:px-8 py-12 font-sans">
      <div className="max-w-400 mx-auto">
        
        {/* HEADER: Context Setting */}
        <div className="mb-12 border-b border-white/10 pb-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 rounded">
                        BEE INDIA STANDARDS
                    </span>
                    <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold border border-cyan-500/20 rounded">
                        ISEER OPTIMIZATION
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Efficiency Drift Analysis
                </h1>
                <p className="text-gray-400 max-w-3xl text-sm leading-relaxed">
                  Appliances lose their <strong className="text-yellow-400">Star Rating</strong> over time due to operational anomalies (dust, leakage, friction). 
                  Comparison below shows how our model detects these drifts to maintain <strong className="text-white">5-Star Compliance</strong> vs. Unmonitored degradation.
                </p>
              </div>
              <div className="text-right hidden md:block">
                 <p className="text-xs text-gray-500 mb-1">Reference Standard</p>
                 <a href="https://beeindia.gov.in/star-label.php" target="_blank" className="text-cyan-400 hover:underline text-sm flex items-center justify-end gap-1">
                    beeindia.gov.in <Info size={14}/>
                 </a>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* 1. MAIN CHART: The "Drift" Argument (8 Cols) */}
            <div className="xl:col-span-8 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingDown className="text-red-400"/> 
                            ISEER Degradation over 12 Months
                        </h3>
                        <p className="text-xs text-gray-500">Impact of Anomaly Detection on Indian Seasonal Energy Efficiency Ratio</p>
                    </div>
                    <StarRating rating={5} />
                </div>

                <div className="h-100">
                    <ResponsiveContainer>
                        <LineChart data={data.driftData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="month" stroke="#555" tick={{fontSize: 10}} />
                            <YAxis domain={[3, 5.5]} stroke="#555" label={{ value: 'ISEER Value', angle: -90, position: 'insideLeft', fill: '#666' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            
                            {/* Comparison Lines */}
                            <Line 
                                type="monotone" 
                                dataKey="WithModel" 
                                name="With Anomaly Detection (Ours)" 
                                stroke="#22d3ee" 
                                strokeWidth={3} 
                                dot={{r:4, fill:'#22d3ee'}} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="WithoutModel" 
                                name="Unmonitored (Standard)" 
                                stroke="#ef4444" 
                                strokeWidth={3} 
                                strokeDasharray="5 5" 
                            />

                            {/* BEE Thresholds */}
                            <ReferenceLine y={5.0} stroke="#eab308" label={{value: 'BEE 5-Star Min', fill: '#eab308', fontSize: 10}} strokeDasharray="3 3"/>
                            <ReferenceLine y={3.8} stroke="#f97316" label={{value: 'BEE 3-Star Min', fill: '#f97316', fontSize: 10}} strokeDasharray="3 3"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. RADAR: Compliance Dimensions (4 Cols) */}
            <div className="xl:col-span-4 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400"/> Standard Compliance
                </h3>
                <p className="text-xs text-gray-500 mb-6">Benchmarking against BEE & Environmental goals</p>

                <div className="h-87.5">
                    <ResponsiveContainer>
                        <RadarChart outerRadius={120} data={data.radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                            
                            <Radar name="Our Optimization" dataKey="OurModel" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                            <Radar name="Standard Appliance" dataKey="StandardAC" stroke="#64748b" fill="#64748b" fillOpacity={0.2} />
                            
                            <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. SCATTER: Efficiency Zone (6 Cols) */}
            <div className="xl:col-span-6 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Zap className="text-amber-400"/> Power Input vs. Cooling Capacity
                </h3>
                <p className="text-xs text-gray-500 mb-6">Identifying inefficient operational clusters</p>
                
                <div className="h-75">
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis type="number" dataKey="cooling_capacity" name="Cooling" unit="W" stroke="#555" label={{ value: 'Cooling Capacity (W)', position: 'insideBottom', offset: -10, fill:'#555', fontSize: 10 }} />
                            <YAxis type="number" dataKey="power_input" name="Power" unit="W" stroke="#555" label={{ value: 'Power Input (W)', angle: -90, position: 'insideLeft', fill:'#555', fontSize: 10 }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            <Legend />
                            <Scatter name="Optimized (Model)" data={data.scatterData.filter((d:any) => d.type.includes('Optimized'))} fill="#22d3ee" shape="circle" />
                            <Scatter name="Drifted (Inefficient)" data={data.scatterData.filter((d:any) => d.type.includes('Drift'))} fill="#ef4444" shape="triangle" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. BAR CHART: Frequency of Usage (6 Cols) */}
            <div className="xl:col-span-6 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-orange-400"/> Anomaly Distribution
                </h3>
                <p className="text-xs text-gray-500 mb-6">Frequency of High-Consumption Events (Monthly)</p>

                <div className="h-75">
                    <ResponsiveContainer>
                        <BarChart data={data.consumptionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="range" stroke="#555" tick={{fontSize: 10}} />
                            <YAxis stroke="#555" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="frequency" name="Frequency" radius={[4, 4, 0, 0]}>
                                {data.consumptionData.map((entry:any, index:number) => (
                                    <Cell key={`cell-${index}`} fill={entry.range.includes('400') ? '#ef4444' : entry.range.includes('300') ? '#f97316' : '#22d3ee'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
      </div>
    </section>
  )
}