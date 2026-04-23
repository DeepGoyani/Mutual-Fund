'use client'

import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { exportPortfolioToPDF, exportPortfolioToExcel } from '@/utils/exportUtils'
import { calculateXIRR } from '@/utils/riskMetrics'
import { LineChart } from '@mui/x-charts/LineChart'
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import GridOnIcon from '@mui/icons-material/GridOn'
import AddIcon from '@mui/icons-material/Add'
import toast from 'react-hot-toast'

export default function PortfolioPage() {
  const { 
    holdings, 
    addHolding, 
    removeHolding, 
    getPortfolioSummary,
    updateHoldingValue 
  } = usePortfolioStore()
  
  const [open, setOpen] = useState(false)
  const [newHolding, setNewHolding] = useState({
    code: '',
    name: '',
    units: '',
    nav: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  
  const summary = getPortfolioSummary()
  
  // Fetch current NAV for all holdings
  useEffect(() => {
    const fetchCurrentNavs = async () => {
      for (const holding of holdings) {
        try {
          const res = await fetch(`https://api.mfapi.in/mf/${holding.code}`)
          if (res.ok) {
            const data = await res.json()
            const latestNav = parseFloat(data?.data?.[0]?.nav)
            if (latestNav) {
              updateHoldingValue(holding.code, latestNav)
            }
          }
        } catch (e) {
          console.error(`Failed to fetch NAV for ${holding.code}`)
        }
      }
    }
    
    if (holdings.length > 0) {
      fetchCurrentNavs()
      const interval = setInterval(fetchCurrentNavs, 60000) // Refresh every minute
      return () => clearInterval(interval)
    }
  }, [holdings.length])
  
  const handleAddHolding = async () => {
    if (!newHolding.code || !newHolding.units || !newHolding.nav) {
      toast.error('Please fill all required fields')
      return
    }
    
    setLoading(true)
    try {
      // Fetch fund name if not provided
      let fundName = newHolding.name
      if (!fundName) {
        const res = await fetch(`https://api.mfapi.in/mf/${newHolding.code}`)
        if (res.ok) {
          const data = await res.json()
          fundName = data.meta?.scheme_name || 'Unknown Fund'
        }
      }
      
      addHolding(
        newHolding.code,
        fundName,
        parseFloat(newHolding.units),
        parseFloat(newHolding.nav),
        newHolding.date
      )
      
      toast.success('Holding added successfully')
      setOpen(false)
      setNewHolding({
        code: '',
        name: '',
        units: '',
        nav: '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (e) {
      toast.error('Failed to add holding')
    }
    setLoading(false)
  }
  
  const handleExportPDF = () => {
    exportPortfolioToPDF(summary, holdings)
    toast.success('PDF exported successfully')
  }
  
  const handleExportExcel = () => {
    exportPortfolioToExcel(summary, holdings)
    toast.success('Excel exported successfully')
  }
  
  // Prepare chart data
  const chartData = holdings.map(h => ({
    name: h.name.slice(0, 20),
    invested: h.units * h.avgNav,
    current: h.currentNav ? h.units * h.currentNav : h.units * h.avgNav
  }))
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Portfolio
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            disabled={holdings.length === 0}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<GridOnIcon />}
            onClick={handleExportExcel}
            disabled={holdings.length === 0}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Holding
          </Button>
        </Box>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Total Invested
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ₹{summary.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Current Value
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ₹{summary.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Total Return
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              color={summary.totalReturn >= 0 ? 'success.main' : 'error.main'}
            >
              {summary.totalReturn >= 0 ? '+' : ''}
              ₹{summary.totalReturn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Return %
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              color={summary.returnPercentage >= 0 ? 'success.main' : 'error.main'}
            >
              {summary.returnPercentage >= 0 ? '+' : ''}
              {summary.returnPercentage.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Chart */}
      {holdings.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio Allocation
          </Typography>
          <LineChart
            xAxis={[{ 
              scaleType: 'point', 
              data: chartData.map(d => d.name),
              tickLabelStyle: { fontSize: 10, angle: 45 }
            }]}
            series={[
              { data: chartData.map(d => d.invested), label: 'Invested', color: '#64748b' },
              { data: chartData.map(d => d.current), label: 'Current Value', color: '#10b981' }
            ]}
            height={300}
          />
        </Paper>
      )}
      
      {/* Holdings Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell>Fund</TableCell>
                <TableCell align="right">Units</TableCell>
                <TableCell align="right">Avg NAV</TableCell>
                <TableCell align="right">Current NAV</TableCell>
                <TableCell align="right">Invested</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">Gain/Loss</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No holdings yet. Click &quot;Add Holding&quot; to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                holdings.map((holding) => {
                  const invested = holding.units * holding.avgNav
                  const currentValue = holding.currentNav 
                    ? holding.units * holding.currentNav 
                    : invested
                  const gain = currentValue - invested
                  const gainPct = invested > 0 ? (gain / invested) * 100 : 0
                  
                  return (
                    <TableRow key={holding.code}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {holding.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {holding.code}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {holding.units.toFixed(3)}
                      </TableCell>
                      <TableCell align="right">
                        ₹{holding.avgNav.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {holding.currentNav ? `₹${holding.currentNav.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        ₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell align="right">
                        ₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${gain >= 0 ? '+' : ''}${gainPct.toFixed(2)}%`}
                          size="small"
                          color={gain >= 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            removeHolding(holding.code)
                            toast.success('Holding removed')
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Add Holding Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Holding</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Scheme Code"
                fullWidth
                required
                value={newHolding.code}
                onChange={(e) => setNewHolding({ ...newHolding, code: e.target.value })}
                placeholder="e.g., 100027"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fund Name (optional)"
                fullWidth
                value={newHolding.name}
                onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                placeholder="Will be fetched automatically"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Units"
                type="number"
                fullWidth
                required
                value={newHolding.units}
                onChange={(e) => setNewHolding({ ...newHolding, units: e.target.value })}
                placeholder="e.g., 100"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Purchase NAV"
                type="number"
                fullWidth
                required
                value={newHolding.nav}
                onChange={(e) => setNewHolding({ ...newHolding, nav: e.target.value })}
                placeholder="e.g., 25.50"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Purchase Date"
                type="date"
                fullWidth
                required
                value={newHolding.date}
                onChange={(e) => setNewHolding({ ...newHolding, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddHolding} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Holding'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
