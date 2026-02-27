'use client'

import { useEffect, useState } from 'react'
import { FileDown, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { exportCombinedReport } from './exportReport'

export default function GenerateReports() {
  const [analytics, setAnalytics] = useState<any | null>(null)
  const [bee, setBee] = useState<any | null>(null)
  const [exporting, setExporting] = useState<'word' | 'latex' | null>(null)

  useEffect(() => {
    fetch('/api/modelevaluationmetrics')
      .then(res => res.json())
      .then(setAnalytics)
      .catch(err => console.error('Failed to load analytics data for report', err))

    fetch('/api/bee-comparison')
      .then(res => res.json())
      .then(setBee)
      .catch(err => console.error('Failed to load BEE comparison data for report', err))
  }, [])

  const ready = Boolean(analytics && bee)

  const handleExport = (format: 'word' | 'latex') => {
    if (!ready) return
    setExporting(format)
    try {
      exportCombinedReport({ analytics, bee, format })
    } finally {
      setTimeout(() => setExporting(null), 400)
    }
  }

  return (
    <div className="bg-[#050505] text-white px-4 md:px-8 pb-12 font-sans">
      <div className="max-w-400 mx-auto">
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FileText className="text-cyan-400" size={20} />
              Generate Full Research Report
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-2 max-w-2xl">
              Exports a complete report combining all analytics, BEE comparison charts, metrics, and literature
              references into a single document suitable for research documentation.
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500 font-mono">
              {ready ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Data loaded from Analytics and Comparison dashboards.</span>
                </>
              ) : (
                <>
                  <Loader2 size={14} className="animate-spin text-cyan-400" />
                  <span>Preparing data from both APIs...</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!ready || exporting === 'word'}
              onClick={() => handleExport('word')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border transition-colors ${
                ready
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
                  : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
              }`}
            >
              <FileDown size={14} />
              {exporting === 'word' ? 'Exporting...' : 'Export Word (.doc)'}
            </button>
            <button
              type="button"
              disabled={!ready || exporting === 'latex'}
              onClick={() => handleExport('latex')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border transition-colors ${
                ready
                  ? 'bg-purple-500/10 text-purple-200 border-purple-500/40 hover:bg-purple-500/20'
                  : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
              }`}
            >
              <FileText size={14} />
              {exporting === 'latex' ? 'Exporting...' : 'Export LaTeX (.tex)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

