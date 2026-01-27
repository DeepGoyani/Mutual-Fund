import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const response = await fetch(`https://api.mfapi.in/mf/${params.code}`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch scheme data')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheme data' },
      { status: 500 }
    )
  }
}