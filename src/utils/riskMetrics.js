// Risk Metrics and Advanced Calculations

/**
 * Calculate XIRR (Extended Internal Rate of Return)
 * @param {Array} cashFlows - Array of {date: 'YYYY-MM-DD', amount: number}
 * @returns {number} XIRR percentage
 */
export function calculateXIRR(cashFlows) {
  if (!cashFlows || cashFlows.length < 2) return null

  // Sort by date
  const sorted = [...cashFlows].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // Convert dates to years from first date
  const firstDate = new Date(sorted[0].date)
  const flows = sorted.map(cf => ({
    years: (new Date(cf.date) - firstDate) / (365.25 * 24 * 60 * 60 * 1000),
    amount: cf.amount
  }))

  // Newton-Raphson method to find XIRR
  let rate = 0.1 // Initial guess: 10%
  const maxIterations = 100
  const precision = 0.000001

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let dNpv = 0

    for (const flow of flows) {
      const factor = Math.pow(1 + rate, flow.years)
      npv += flow.amount / factor
      dNpv -= (flow.years * flow.amount) / (factor * (1 + rate))
    }

    if (Math.abs(npv) < precision) {
      return rate * 100
    }

    const newRate = rate - npv / dNpv
    if (Math.abs(newRate - rate) < precision) {
      return newRate * 100
    }
    rate = newRate
  }

  return rate * 100
}

/**
 * Calculate Simple Annualized Return
 * @param {number} startValue - Initial investment
 * @param {number} endValue - Current value
 * @param {number} years - Number of years
 * @returns {number} Annualized return percentage
 */
export function calculateAnnualizedReturn(startValue, endValue, years) {
  if (!startValue || !endValue || years <= 0) return null
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
}

/**
 * Calculate Volatility (Standard Deviation of Returns)
 * @param {Array} navData - Array of {date, nav} sorted by date desc
 * @param {number} periodDays - Period for returns calculation (default 30)
 * @returns {number} Annualized volatility percentage
 */
export function calculateVolatility(navData, periodDays = 30) {
  if (!navData || navData.length < periodDays + 1) return null

  const returns = []
  for (let i = 0; i < navData.length - periodDays; i++) {
    const current = parseFloat(navData[i].nav)
    const past = parseFloat(navData[i + periodDays].nav)
    if (past > 0) {
      const periodReturn = (current - past) / past
      returns.push(periodReturn)
    }
  }

  if (returns.length === 0) return null

  const avg = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)

  // Annualize (assuming 252 trading days)
  return stdDev * Math.sqrt(252 / periodDays) * 100
}

/**
 * Calculate Sharpe Ratio
 * @param {number} annualizedReturn - Annualized return %
 * @param {number} volatility - Annualized volatility %
 * @param {number} riskFreeRate - Risk-free rate % (default 6%)
 * @returns {number} Sharpe ratio
 */
export function calculateSharpeRatio(annualizedReturn, volatility, riskFreeRate = 6) {
  if (!volatility || volatility === 0) return null
  return (annualizedReturn - riskFreeRate) / volatility
}

/**
 * Calculate Maximum Drawdown
 * @param {Array} navData - Array of {date, nav} sorted by date desc
 * @returns {Object} { maxDrawdown: number %, peakDate: string, troughDate: string }
 */
export function calculateMaxDrawdown(navData) {
  if (!navData || navData.length === 0) return null

  let peak = parseFloat(navData[0].nav)
  let peakDate = navData[0].date
  let maxDrawdown = 0
  let troughDate = navData[0].date

  for (const point of navData) {
    const nav = parseFloat(point.nav)
    
    if (nav > peak) {
      peak = nav
      peakDate = point.date
    }
    
    const drawdown = (peak - nav) / peak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
      troughDate = point.date
    }
  }

  return {
    maxDrawdown: maxDrawdown * 100,
    peakDate,
    troughDate
  }
}

/**
 * Calculate Beta (relative to market)
 * @param {Array} fundReturns - Array of periodic returns
 * @param {Array} marketReturns - Array of market returns for same periods
 * @returns {number} Beta value
 */
export function calculateBeta(fundReturns, marketReturns) {
  if (!fundReturns || !marketReturns || fundReturns.length !== marketReturns.length) {
    return null
  }

  const n = fundReturns.length
  const avgFund = fundReturns.reduce((sum, r) => sum + r, 0) / n
  const avgMarket = marketReturns.reduce((sum, r) => sum + r, 0) / n

  let covariance = 0
  let marketVariance = 0

  for (let i = 0; i < n; i++) {
    const fundDiff = fundReturns[i] - avgFund
    const marketDiff = marketReturns[i] - avgMarket
    covariance += fundDiff * marketDiff
    marketVariance += marketDiff * marketDiff
  }

  covariance /= n
  marketVariance /= n

  return marketVariance !== 0 ? covariance / marketVariance : null
}

/**
 * Get Risk Level based on volatility
 * @param {number} volatility - Annualized volatility %
 * @returns {string} Risk level: 'Low', 'Moderate', 'High', 'Very High'
 */
export function getRiskLevel(volatility) {
  if (!volatility) return 'Unknown'
  if (volatility < 10) return 'Low'
  if (volatility < 20) return 'Moderate'
  if (volatility < 30) return 'High'
  return 'Very High'
}

/**
 * Get Risk Color for UI
 * @param {string} riskLevel - Risk level string
 * @returns {string} Color class
 */
export function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'Low': return 'text-green-600 bg-green-100'
    case 'Moderate': return 'text-yellow-600 bg-yellow-100'
    case 'High': return 'text-orange-600 bg-orange-100'
    case 'Very High': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Calculate Goal Progress
 * @param {number} targetAmount - Target corpus
 * @param {number} currentValue - Current value
 * @param {number} monthlySip - Monthly SIP amount
 * @param {number} expectedReturn - Expected annual return %
 * @param {Date} targetDate - Target date
 * @returns {Object} Progress analysis
 */
export function calculateGoalProgress(targetAmount, currentValue, monthlySip, expectedReturn = 12, targetDate) {
  const yearsRemaining = (new Date(targetDate) - new Date()) / (365.25 * 24 * 60 * 60 * 1000)
  const monthsRemaining = Math.max(0, yearsRemaining * 12)
  
  // Future value of current investments
  const futureValueCurrent = currentValue * Math.pow(1 + expectedReturn / 100, yearsRemaining)
  
  // Future value of SIP
  const monthlyRate = expectedReturn / 1200
  const futureValueSip = monthlySip * (Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate * (1 + monthlyRate)
  
  const projectedValue = futureValueCurrent + futureValueSip
  const gap = targetAmount - projectedValue
  const progressPercentage = (currentValue / targetAmount) * 100
  const onTrack = projectedValue >= targetAmount
  
  // Calculate required SIP to meet goal
  const shortfall = Math.max(0, targetAmount - futureValueCurrent)
  const requiredSip = shortfall > 0 && monthsRemaining > 0
    ? shortfall / ((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate * (1 + monthlyRate))
    : 0

  return {
    yearsRemaining,
    monthsRemaining: Math.ceil(monthsRemaining),
    projectedValue,
    gap,
    progressPercentage,
    onTrack,
    requiredSip: Math.ceil(requiredSip),
    canAchieve: requiredSip > 0 && requiredSip < monthlySip * 3 // Within 3x current SIP
  }
}
