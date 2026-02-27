import { NextResponse } from 'next/server'
import { getBackendBaseUrl } from '@/lib/backendApi'

export async function GET() {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/model-evaluation`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch BEE comparison from backend' },
        { status: res.status }
      )
    }
    const payload = await res.json()
    return NextResponse.json(payload.bee_comparison ?? {})
  } catch {
    return NextResponse.json(
      { error: 'Backend connection failed for BEE comparison API' },
      { status: 502 }
    )
  }
}
