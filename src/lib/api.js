// API configuration for deployed backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://mutual-fund-q5qt.onrender.com'

export const apiEndpoints = {
  funds: `${API_BASE_URL}/api/funds`,
  fundsSearch: `${API_BASE_URL}/api/funds/search`,
  mf: `${API_BASE_URL}/api/mf`,
  scheme: (code) => `${API_BASE_URL}/api/scheme/${code}`,
  schemeSip: (code) => `${API_BASE_URL}/api/scheme/${code}/sip`,
  schemeLumpsum: (code) => `${API_BASE_URL}/api/scheme/${code}/lumpsum`,
  schemeReturns: (code) => `${API_BASE_URL}/api/scheme/${code}/returns`,
  marketSnapshot: `${API_BASE_URL}/api/market/snapshot`,
  cronDailySync: `${API_BASE_URL}/api/cron/daily-sync`,
}

export const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

export const mfAPI = {
  // Direct MFAPI calls as fallback
  baseURL: 'https://api.mfapi.in',
  
  async getSchemeList() {
    const response = await fetch(`${this.baseURL}/`)
    return response.json()
  },
  
  async getSchemeData(code) {
    const response = await fetch(`${this.baseURL}/mf/${code}`)
    return response.json()
  },
}
