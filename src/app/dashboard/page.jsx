'use client'

import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { calculateVolatility } from '@/utils/riskMetrics'
import { LineChart, PieChart } from '@mui/x-charts'
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import Link from 'next/link'

export default function DashboardPage() {
  const { holdings, watchlist, getPortfolioSummary } = usePortfolioStore()
  const [topFunds, setTopFunds] = useState([])
  const [loading, setLoading] = useState(true)
  
  const summary = getPortfolioSummary()
  
  // Fetch market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch some popular funds for top performers
        const popularCodes = ['122639', '120492', '125497', '118825', '125354']
        const fundPromises = popularCodes.map(async (code) => {
          try {
            const res = await fetch(`https://api.mfapi.in/mf/${code}`)
            if (res.ok) {
              const data = await res.json()
              const navData = data?.data || []
              
              // Calculate 1 month return
              const current = parseFloat(navData[0]?.nav || 0)
              const monthAgo = parseFloat(navData[30]?.nav || navData[navData.length - 1]?.nav || current)
              const return1M = monthAgo > 0 ? ((current - monthAgo) / monthAgo) * 100 : 0
              
              return {
                code,
                name: data.meta?.scheme_name || 'Unknown',
                nav: current,
                date: navData[0]?.date,
                return1M,
                volatility: calculateVolatility(navData, 30) || 0
              }
            }
          } catch (e) {
            return null
          }
        })
        
        const funds = (await Promise.all(fundPromises)).filter(Boolean)
        
        // Sort by 1M return for top performers
        const sorted = funds.sort((a, b) => b.return1M - a.return1M)
        setTopFunds(sorted.slice(0, 5))
        
        setLoading(false)
      } catch (e) {
        console.error('Failed to fetch market data')
        setLoading(false)
      }
    }
    
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])
  
  // Prepare portfolio allocation data
  const allocationData = holdings.map(h => ({
    id: h.code,
    value: h.units * (h.currentNav || h.avgNav),
    label: h.name.slice(0, 20)
  }))
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Portfolio Overview */}
      {holdings.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Performance
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Invested
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{summary.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current Value
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ₹{summary.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Return
                    </Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      color={summary.totalReturn >= 0 ? 'success.main' : 'error.main'}
                    >
                      {summary.totalReturn >= 0 ? '+' : ''}
                      {summary.returnPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
                
                <LineChart
                  xAxis={[{ 
                    scaleType: 'point', 
                    data: holdings.map(h => h.name.slice(0, 15))
                  }]}
                  series={[
                    { 
                      data: holdings.map(h => h.units * h.avgNav), 
                      label: 'Invested',
                      color: '#64748b'
                    },
                    { 
                      data: holdings.map(h => h.units * (h.currentNav || h.avgNav)), 
                      label: 'Current Value',
                      color: '#10b981'
                    }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Asset Allocation
                </Typography>
                {allocationData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: allocationData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                      }
                    ]}
                    height={250}
                    slotProps={{
                      legend: { hidden: true }
                    }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
                    <Typography color="text.secondary">No data</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Market Overview */}
      <Grid container spacing={3}>
        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performers (1 Month)
            </Typography>
            {loading ? (
              <>
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
              </>
            ) : topFunds.length > 0 ? (
              <List>
                {topFunds.map((fund) => (
                  <ListItem
                    key={fund.code}
                    component={Link}
                    href={`/learn/fund/${fund.code}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                  >
                    <ListItemText
                      primary={fund.name}
                      secondary={`NAV: ₹${fund.nav?.toFixed(2)} | ${fund.date}`}
                    />
                    <Chip
                      icon={fund.return1M >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={`${fund.return1M >= 0 ? '+' : ''}${fund.return1M.toFixed(2)}%`}
                      color={fund.return1M >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No data available</Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Watchlist Quick View */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Watchlist ({watchlist.length})
            </Typography>
            {watchlist.length === 0 ? (
              <Typography color="text.secondary">
                No funds in watchlist. Add funds to track their performance.
              </Typography>
            ) : (
              <List>
                {watchlist.slice(0, 5).map((item) => (
                  <ListItem
                    key={item.code}
                    component={Link}
                    href={`/learn/fund/${item.code}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={item.code}
                    />
                    <Chip
                      label="Tracked"
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </ListItem>
                ))}
                {watchlist.length > 5 && (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      +{watchlist.length - 5} more funds
                    </Typography>
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              label="View Portfolio"
              component={Link}
              href="/portfolio"
              clickable
              color="primary"
            />
          </Grid>
          <Grid item>
            <Chip
              label="Set Goals"
              component={Link}
              href="/goals"
              clickable
              color="secondary"
            />
          </Grid>
          <Grid item>
            <Chip
              label="Compare Funds"
              component={Link}
              href="/market/compare"
              clickable
            />
          </Grid>
          <Grid item>
            <Chip
              label="Explore Funds"
              component={Link}
              href="/funds"
              clickable
            />
          </Grid>
          <Grid item>
            <Chip
              label="Calculators"
              component={Link}
              href="/learn/tools"
              clickable
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
