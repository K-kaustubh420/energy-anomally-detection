interface ExportParams {
  analytics: any | null
  bee: any | null
  format: 'word' | 'latex'
}

const safeNumber = (value: any, digits = 3): string => {
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return 'N/A'
  return num.toFixed(digits)
}

const escapeLatex = (text: any): string => {
  if (text == null) return ''
  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\^/g, '\\^{}')
    .replace(/~/g, '\\~{}')
}

const triggerDownload = (filename: string, mimeType: string, content: string) => {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const buildWordHtml = (analytics: any, bee: any): string => {
  const m = analytics?.metrics || {}
  const cm = analytics?.confusion_matrix || [[0, 0],[0, 0]]

  const multivariate = Array.isArray(analytics?.multivariate_stream) ? analytics.multivariate_stream : []
  const roc = Array.isArray(analytics?.roc_curve) ? analytics.roc_curve : []
  const featureImp = Array.isArray(analytics?.feature_importance) ? analytics.feature_importance : []
  const analyticsRadar = Array.isArray(analytics?.radar_data) ? analytics.radar_data : []
  const papers = Array.isArray(analytics?.research_comparison) ? analytics.research_comparison : []

  const drift = Array.isArray(bee?.driftData) ? bee.driftData : []
  const beeRadar = Array.isArray(bee?.radarData) ? bee.radarData : []
  const scatter = Array.isArray(bee?.scatterData) ? bee.scatterData : []
  const consumption = Array.isArray(bee?.consumptionData) ? bee.consumptionData : []

  const withModelAvg =
    drift.length > 0
      ? drift.reduce((sum: number, d: any) => sum + (d.WithModel ?? 0), 0) / drift.length
      : 0
  const withoutModelAvg =
    drift.length > 0
      ? drift.reduce((sum: number, d: any) => sum + (d.WithoutModel ?? 0), 0) / drift.length
      : 0

  const highestBucket = consumption.reduce(
    (best: any, current: any) =>
      !best || (current?.frequency ?? 0) > (best?.frequency ?? 0) ? current : best,
    null as any
  )

  const multivariateRows = multivariate
    .map(
      (row: any) => `
        <tr>
          <td>${row.time ?? ''}</td>
          <td>${safeNumber(row.Appliances, 2)}</td>
          <td>${safeNumber(row.T_out, 2)}</td>
          <td>${row.isAnomaly ? 'Yes' : 'No'}</td>
        </tr>`
    )
    .join('')

  const rocRows = roc
    .map(
      (row: any) => `
        <tr>
          <td>${safeNumber(row.fpr, 3)}</td>
          <td>${safeNumber(row.tpr, 3)}</td>
        </tr>`
    )
    .join('')

  const featureRows = featureImp
    .map(
      (row: any) => `
        <tr>
          <td>${row.feature}</td>
          <td>${safeNumber(row.value, 3)}</td>
        </tr>`
    )
    .join('')

  const analyticsRadarRows = analyticsRadar
    .map(
      (row: any) => `
        <tr>
          <td>${row.subject}</td>
          <td>${safeNumber(row.OurModel, 0)}</td>
          <td>${safeNumber(row.DeepLearning, 0)}</td>
          <td>${safeNumber(row.Statistical, 0)}</td>
        </tr>`
    )
    .join('')

  const driftRows = drift
    .map(
      (row: any) => `
        <tr>
          <td>${row.month}</td>
          <td>${safeNumber(row.WithModel, 3)}</td>
          <td>${safeNumber(row.WithoutModel, 3)}</td>
        </tr>`
    )
    .join('')

  const beeRadarRows = beeRadar
    .map(
      (row: any) => `
        <tr>
          <td>${row.subject}</td>
          <td>${safeNumber(row.OurModel, 0)}</td>
          <td>${safeNumber(row.StandardAC, 0)}</td>
        </tr>`
    )
    .join('')

  const scatterRows = scatter
    .map(
      (row: any) => `
        <tr>
          <td>${safeNumber(row.cooling_capacity, 0)}</td>
          <td>${safeNumber(row.power_input, 0)}</td>
          <td>${row.type}</td>
        </tr>`
    )
    .join('')

  const consumptionRows = consumption
    .map(
      (row: any) => `
        <tr>
          <td>${row.range}</td>
          <td>${safeNumber(row.frequency, 0)}</td>
        </tr>`
    )
    .join('')

  const papersHtml = papers
    .map(
      (p: any) => `
        <h3>${p.title}</h3>
        <p><strong>Authors:</strong> ${p.author}</p>
        <p><strong>Tag:</strong> ${p.tag}</p>
        <p><strong>Link:</strong> <a href="${p.link}">${p.link}</a></p>
        <p><strong>Abstract:</strong> ${p.abstract}</p>
        <p><strong>Strength:</strong> ${p.pros}</p>
        <p><strong>Limitation:</strong> ${p.cons}</p>
        <p><strong>Our Advantage:</strong> ${p.our_advantage}</p>
      `
    )
    .join('')

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Energy Anomaly Detection Report</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; }
      h1, h2, h3 { color: #111827; }
      table { border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; }
      th, td { border: 1px solid #4b5563; padding: 4px 8px; font-size: 12px; }
      th { background: #e5e7eb; }
    </style>
  </head>
  <body>
    <h1>Energy Anomaly Detection &amp; BEE Comparison Report</h1>

    <h2>1. Model Evaluation Metrics (Isolation Forest)</h2>
    <ul>
      <li>Precision: <strong>${safeNumber(m.precision)}</strong></li>
      <li>Recall: <strong>${safeNumber(m.recall)}</strong></li>
      <li>F1 Score: <strong>${safeNumber(m.f1_score)}</strong></li>
      <li>ROC AUC: <strong>${safeNumber(m.roc_auc)}</strong></li>
      <li>Inference Time (edge latency): <strong>${safeNumber(m.inference_time, 2)} ms</strong></li>
    </ul>

    <h3>Confusion Matrix</h3>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Predicted: Normal</th>
          <th>Predicted: Anomaly</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Actual: Normal</th>
          <td>${cm?.[0]?.[0] ?? '0'}</td>
          <td>${cm?.[0]?.[1] ?? '0'}</td>
        </tr>
        <tr>
          <th>Actual: Anomaly</th>
          <td>${cm?.[1]?.[0] ?? '0'}</td>
          <td>${cm?.[1]?.[1] ?? '0'}</td>
        </tr>
      </tbody>
    </table>

    <h3>Multivariate Time-Series (Appliances vs T_out)</h3>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Appliances (Wh)</th>
          <th>T_out</th>
          <th>Anomaly</th>
        </tr>
      </thead>
      <tbody>
        ${multivariateRows}
      </tbody>
    </table>

    <h3>ROC Curve Points</h3>
    <table>
      <thead>
        <tr>
          <th>FPR</th>
          <th>TPR</th>
        </tr>
      </thead>
      <tbody>
        ${rocRows}
      </tbody>
    </table>

    <h3>Feature Importance</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Importance</th>
        </tr>
      </thead>
      <tbody>
        ${featureRows}
      </tbody>
    </table>

    <h3>Radar Comparison (Analytics)</h3>
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Our Model</th>
          <th>Deep Learning</th>
          <th>Statistical</th>
        </tr>
      </thead>
      <tbody>
        ${analyticsRadarRows}
      </tbody>
    </table>

    <h2>2. BEE Efficiency Drift &amp; Compliance</h2>
    <p>
      The BEE comparison module analyses how appliance efficiency drifts over time and how
      anomaly detection helps maintain star-rating compliance.
    </p>

    <h3>ISEER Degradation (12-Month Summary)</h3>
    <ul>
      <li>Average ISEER with anomaly detection: <strong>${safeNumber(withModelAvg, 2)}</strong></li>
      <li>Average ISEER without monitoring: <strong>${safeNumber(withoutModelAvg, 2)}</strong></li>
    </ul>

    <h3>ISEER Time-Series</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>With Anomaly Detection</th>
          <th>Without Monitoring</th>
        </tr>
      </thead>
      <tbody>
        ${driftRows}
      </tbody>
    </table>

    <h3>BEE Radar Dimensions</h3>
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Our Optimization</th>
          <th>Standard Appliance</th>
        </tr>
      </thead>
      <tbody>
        ${beeRadarRows}
      </tbody>
    </table>

    <h3>Power vs Cooling Scatter Data</h3>
    <table>
      <thead>
        <tr>
          <th>Cooling Capacity (W)</th>
          <th>Power Input (W)</th>
          <th>Cluster Type</th>
        </tr>
      </thead>
      <tbody>
        ${scatterRows}
      </tbody>
    </table>

    <h3>Anomaly Distribution</h3>
    <table>
      <thead>
        <tr>
          <th>Consumption Range (Wh)</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        ${consumptionRows}
      </tbody>
    </table>

    ${
      highestBucket
        ? `<p>
      Highest frequency of high-consumption events occurs in the
      <strong>${highestBucket.range}</strong> bucket with
      <strong>${highestBucket.frequency}</strong> occurrences.
    </p>`
        : ''
    }

    <h2>3. Literature Comparison</h2>
    ${papersHtml}

    <p>
      This document was automatically generated from the interactive analytics dashboard
      and comparison visualizations.
    </p>
  </body>
</html>`
}

const buildLatex = (analytics: any, bee: any): string => {
  const m = analytics?.metrics || {}
  const cm = analytics?.confusion_matrix || [[0, 0],[0, 0]]

  const multivariate = Array.isArray(analytics?.multivariate_stream) ? analytics.multivariate_stream : []
  const roc = Array.isArray(analytics?.roc_curve) ? analytics.roc_curve : []
  const featureImp = Array.isArray(analytics?.feature_importance) ? analytics.feature_importance : []
  const analyticsRadar = Array.isArray(analytics?.radar_data) ? analytics.radar_data : []
  const papers = Array.isArray(analytics?.research_comparison) ? analytics.research_comparison : []

  const drift = Array.isArray(bee?.driftData) ? bee.driftData : []
  const beeRadar = Array.isArray(bee?.radarData) ? bee.radarData : []
  const scatter = Array.isArray(bee?.scatterData) ? bee.scatterData : []
  const consumption = Array.isArray(bee?.consumptionData) ? bee.consumptionData : []

  const withModelAvg =
    drift.length > 0
      ? drift.reduce((sum: number, d: any) => sum + (d.WithModel ?? 0), 0) / drift.length
      : 0
  const withoutModelAvg =
    drift.length > 0
      ? drift.reduce((sum: number, d: any) => sum + (d.WithoutModel ?? 0), 0) / drift.length
      : 0

  const highestBucket = consumption.reduce(
    (best: any, current: any) =>
      !best || (current?.frequency ?? 0) > (best?.frequency ?? 0) ? current : best,
    null as any
  )

  const multivariateRows = multivariate
    .map(
      (row: any, idx: number) =>
        `${escapeLatex(row.time ?? idx + 1)} & ${safeNumber(row.Appliances, 2)} & ${safeNumber(row.T_out, 2)} & ${
          row.isAnomaly ? 'Yes' : 'No'
        } \\\\`
    )
    .join('\n')

  const rocRows = roc
    .map(
      (row: any) =>
        `${safeNumber(row.fpr, 3)} & ${safeNumber(row.tpr, 3)} \\\\`
    )
    .join('\n')

  const featureRows = featureImp
    .map(
      (row: any) =>
        `${escapeLatex(row.feature)} & ${safeNumber(row.value, 3)} \\\\`
    )
    .join('\n')

  const analyticsRadarRows = analyticsRadar
    .map(
      (row: any) =>
        `${escapeLatex(row.subject)} & ${safeNumber(row.OurModel, 0)} & ${safeNumber(
          row.DeepLearning,
          0
        )} & ${safeNumber(row.Statistical, 0)} \\\\`
    )
    .join('\n')

  const driftRows = drift
    .map(
      (row: any) =>
        `${escapeLatex(row.month)} & ${safeNumber(row.WithModel, 3)} & ${safeNumber(row.WithoutModel, 3)} \\\\`
    )
    .join('\n')

  const beeRadarRows = beeRadar
    .map(
      (row: any) =>
        `${escapeLatex(row.subject)} & ${safeNumber(row.OurModel, 0)} & ${safeNumber(row.StandardAC, 0)} \\\\`
    )
    .join('\n')

  const scatterRows = scatter
    .map(
      (row: any) =>
        `${safeNumber(row.cooling_capacity, 0)} & ${safeNumber(row.power_input, 0)} & ${escapeLatex(
          row.type
        )} \\\\`
    )
    .join('\n')

  const consumptionRows = consumption
    .map(
      (row: any) =>
        `${escapeLatex(row.range)} & ${safeNumber(row.frequency, 0)} \\\\`
    )
    .join('\n')

  const papersSection = papers
    .map(
      (p: any) => `
\\subsection{${escapeLatex(p.title)}}
\\textbf{Authors}: ${escapeLatex(p.author)}\\\\
\\textbf{Tag}: ${escapeLatex(p.tag)}\\\\
\\textbf{Link}: \\texttt{${escapeLatex(p.link)}}\\\\

\\textbf{Abstract}: ${escapeLatex(p.abstract)}\\\\
\\textbf{Strength}: ${escapeLatex(p.pros)}\\\\
\\textbf{Limitation}: ${escapeLatex(p.cons)}\\\\
\\textbf{Our Advantage}: ${escapeLatex(p.our_advantage)}\\\\
`
    )
    .join('\n')

  return `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{hyperref}

\\begin{document}

\\title{Energy Anomaly Detection \\\\ and BEE Comparison Report}
\\author{Automatically Generated Dashboard Export}
\\date{\\today}
\\maketitle

\\section{Model Evaluation Metrics (Isolation Forest)}

\\begin{itemize}
  \\item Precision: \\textbf{${safeNumber(m.precision)}}
  \\item Recall: \\textbf{${safeNumber(m.recall)}}
  \\item F1 Score: \\textbf{${safeNumber(m.f1_score)}}
  \\item ROC AUC: \\textbf{${safeNumber(m.roc_auc)}}
  \\item Inference Time (edge latency): \\textbf{${safeNumber(m.inference_time, 2)} ms}
\\end{itemize}

\\subsection{Confusion Matrix}

\\begin{center}
  \\begin{tabular}{lcc}
    \\toprule
      & Predicted: Normal & Predicted: Anomaly \\\\
    \\midrule
    Actual: Normal  & ${cm?.[0]?.[0] ?? '0'} & ${cm?.[0]?.[1] ?? '0'} \\\\
    Actual: Anomaly & ${cm?.[1]?.[0] ?? '0'} & ${cm?.[1]?.[1] ?? '0'} \\\\
    \\bottomrule
  \\end{tabular}
\\end{center}

\\subsection{Multivariate Time-Series Analysis}

\\begin{longtable}{llll}
\\toprule
Time & Appliances (Wh) & T\\_out & Anomaly \\\\
\\midrule
\\endhead
${multivariateRows}
\\\\
\\bottomrule
\\end{longtable}

\\subsection{ROC Curve Points}

\\begin{tabular}{ll}
\\toprule
FPR & TPR \\\\
\\midrule
${rocRows}
\\\\
\\bottomrule
\\end{tabular}

\\subsection{Feature Importance}

\\begin{tabular}{ll}
\\toprule
Feature & Importance \\\\
\\midrule
${featureRows}
\\\\
\\bottomrule
\\end{tabular}

\\subsection{Radar Comparison (Analytics)}

\\begin{tabular}{llll}
\\toprule
Dimension & Our Model & Deep Learning & Statistical \\\\
\\midrule
${analyticsRadarRows}
\\\\
\\bottomrule
\\end{tabular}

\\section{BEE Efficiency Drift and Compliance}

The BEE comparison module analyses how appliance efficiency drifts over time and how
anomaly detection helps maintain star-rating compliance.

\\subsection{ISEER Degradation (12-Month Summary)}

\\begin{itemize}
  \\item Average ISEER with anomaly detection: \\textbf{${safeNumber(withModelAvg, 2)}}
  \\item Average ISEER without monitoring: \\textbf{${safeNumber(withoutModelAvg, 2)}}
\\end{itemize}

\\subsection{ISEER Time-Series}

\\begin{tabular}{lll}
\\toprule
Month & With Anomaly Detection & Without Monitoring \\\\
\\midrule
${driftRows}
\\\\
\\bottomrule
\\end{tabular}

\\subsection{BEE Radar Dimensions}

\\begin{tabular}{lll}
\\toprule
Dimension & Our Optimization & Standard Appliance \\\\
\\midrule
${beeRadarRows}
\\\\
\\bottomrule
\\end{tabular}

\\subsection{Power vs Cooling Scatter Data}

\\begin{tabular}{lll}
\\toprule
Cooling Capacity (W) & Power Input (W) & Cluster Type \\\\
\\midrule
${scatterRows}
\\\\
\\bottomrule
\\end{tabular}

\\subsection{Anomaly Distribution}

\\begin{tabular}{ll}
\\toprule
Consumption Range (Wh) & Frequency \\\\
\\midrule
${consumptionRows}
\\\\
\\bottomrule
\\end{tabular}

${highestBucket
  ? `The highest frequency of high-consumption events occurs in the
\\textbf{${escapeLatex(highestBucket.range)}} bucket with
\\textbf{${safeNumber(highestBucket.frequency, 0)}} occurrences.
`
  : ''}

\\section{Literature Comparison}

${papersSection}

\\vspace{1em}

This report was automatically generated from the interactive analytics dashboard and
comparison visualizations.

\\end{document}
`
}

export const exportCombinedReport = ({ analytics, bee, format }: ExportParams) => {
  if (!analytics || !bee) {
    if (typeof window !== 'undefined') {
      window.alert('Report data is not ready yet. Please wait for all charts to load.')
    }
    return
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

  if (format === 'word') {
    const html = buildWordHtml(analytics, bee)
    triggerDownload(`energy-report-${timestamp}.doc`, 'application/msword', html)
  } else {
    const tex = buildLatex(analytics, bee)
    triggerDownload(`energy-report-${timestamp}.tex`, 'application/x-tex', tex)
  }
}

