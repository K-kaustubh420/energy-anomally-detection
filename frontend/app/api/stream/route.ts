import { NextResponse } from 'next/server';

interface EnergyDataPoint {
  id: string;
  currentUsage: number; // Units/Watts (matches model training)
  voltage: number;
  frequency: number;
  timestamp: string;
  status: 'optimal' | 'warning' | 'critical';
}

export async function GET() {
  const now = new Date().toISOString();
  
  const streams: EnergyDataPoint[] = [
    {
      id: 'normal_household',
      // Stays in the 150-250 range (Normal according to your test)
      currentUsage: Number((180 + (Math.random() * 70)).toFixed(2)),
      voltage: 230.1,
      frequency: 50.01,
      timestamp: now,
      status: 'optimal',
    },
    {
      id: 'industrial_overuse',
      // Fluctuates around the 600 threshold to trigger "discovery"
      currentUsage: Number((550 + (Math.random() * 150)).toFixed(2)),
      voltage: 400.2,
      frequency: 50.00,
      timestamp: now,
      status: 'warning',
    },
    {
  id: 'erratic_load',
  // Swings between 200 (Normal) and 615 (Anomaly) to show the change live
  currentUsage: Math.random() > 0.5 
    ? Number((610 + Math.random() * 20).toFixed(2)) 
    : Number((200 + Math.random() * 50).toFixed(2)),
  voltage: 230,
  frequency: 49.9,
  timestamp: now,
  status: 'warning',
},
{
  id: 'critical_fault',
  // FORCE ANOMALY: Stays exactly in the zone your test script confirmed
  currentUsage: Number((600 + (Math.random() * 50)).toFixed(2)),
  voltage: 210.5,
  frequency: 48.2,
  timestamp: now,
  status: 'critical',
}
  ];

  return NextResponse.json(streams);
}