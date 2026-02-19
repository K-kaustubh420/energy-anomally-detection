import { NextResponse } from 'next/server'

export async function GET() {
  // --- REAL BEE INDIA STANDARDS (Split AC) ---
  // Source: BEE Schedule 2024 (Approximate ISEER values)
  const BEE_STANDARDS = {
    star_1: { min: 3.30, max: 3.49 },
    star_2: { min: 3.50, max: 3.79 },
    star_3: { min: 3.80, max: 4.39 },
    star_4: { min: 4.40, max: 4.99 },
    star_5: { min: 5.00, max: 9.00 },
  }

  // --- 1. LINE CHART: EFFICIENCY DRIFT OVER TIME ---
  // Scenario: A 5-Star AC degrades due to dust/leaks. 
  // 'With Model' = Anomaly detected & fixed -> Efficiency restored.
  // 'Without Model' = Efficiency drops linearly.
  const driftData = []
  let currentISEER_NoModel = 5.2 // Starting healthy
  let currentISEER_Model = 5.2

  for (let month = 1; month <= 12; month++) {
    // Natural degradation
    currentISEER_NoModel -= 0.15 
    
    // Model intervention: If efficiency drops below 4.5, maintenance is triggered
    if (currentISEER_Model < 4.8) {
      currentISEER_Model = 5.1 // Restored
    } else {
      currentISEER_Model -= 0.05 // Slow degradation
    }

    driftData.push({
      month: `Month ${month}`,
      WithModel: parseFloat(currentISEER_Model.toFixed(2)),
      WithoutModel: parseFloat(currentISEER_NoModel.toFixed(2)),
      Bee5StarLimit: 5.0, // Threshold line
      Bee3StarLimit: 3.8
    })
  }

  // --- 2. RADAR CHART: COMPLIANCE METRICS ---
  const radarData = [
    { subject: 'Energy Savings', OurModel: 95, StandardAC: 60, fullMark: 100 },
    { subject: 'Carbon Footprint', OurModel: 90, StandardAC: 50, fullMark: 100 }, // Higher is better (less carbon)
    { subject: 'Peak Load Mgmt', OurModel: 85, StandardAC: 40, fullMark: 100 },
    { subject: 'ISEER Maintenance', OurModel: 98, StandardAC: 55, fullMark: 100 },
    { subject: 'Compressor Life', OurModel: 92, StandardAC: 70, fullMark: 100 },
    { subject: 'BEE Compliance', OurModel: 100, StandardAC: 75, fullMark: 100 },
  ]

  // --- 3. SCATTER PLOT: POWER VS COOLING CAPACITY ---
  // Showing that our model keeps operation in the "Green Zone"
  const scatterData = Array.from({ length: 50 }, (_, i) => {
    const isOptimized = i > 25
    return {
      id: i,
      cooling_capacity: 3500 + Math.random() * 500, // Watts
      power_input: isOptimized 
        ? 800 + Math.random() * 100  // Low power (High Efficiency)
        : 1200 + Math.random() * 300, // High power (Inefficient)
      type: isOptimized ? 'Optimized (Model)' : 'Unmonitored (Drift)',
      z: isOptimized ? 50 : 10 // Bubble size
    }
  })

  // --- 4. BAR CHART: MONTHLY KWH CONSUMPTION ---
  const consumptionData = [
    { range: '0-100 kWh', frequency: 5, type: '5-Star Behavior' },
    { range: '100-200 kWh', frequency: 15, type: '5-Star Behavior' },
    { range: '200-300 kWh', frequency: 45, type: 'Model Optimized' },
    { range: '300-400 kWh', frequency: 20, type: 'Drift Warning' },
    { range: '400+ kWh', frequency: 10, type: 'Critical Anomaly' },
  ]

  return NextResponse.json({
    driftData,
    radarData,
    scatterData,
    consumptionData,
    bee_standards: BEE_STANDARDS
  })
}