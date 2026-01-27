import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    // Fetch data from MFAPI
    const response = await fetch('https://api.mfapi.in/mf', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch funds data')
    }

    const data = await response.json()
    
    let filteredData = data

    // Apply filters
    if (search) {
      filteredData = filteredData.filter(fund =>
        fund.schemeName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category && category !== 'all') {
      filteredData = filteredData.filter(fund =>
        fund.category?.toLowerCase() === category.toLowerCase()
      )
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funds data' },
      { status: 500 }
    )
  }
}