'use client'

import { useState } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { calculateGoalProgress } from '@/utils/riskMetrics'
import { exportGoalToPDF } from '@/utils/exportUtils'
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  LinearProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import toast from 'react-hot-toast'

export default function GoalsPage() {
  const { goals, addGoal, removeGoal, updateGoalProgress } = usePortfolioStore()
  const [open, setOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlySip: '',
    currentValue: ''
  })
  const [expectedReturn, setExpectedReturn] = useState(12)
  
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate || !newGoal.monthlySip) {
      toast.error('Please fill all required fields')
      return
    }
    
    addGoal(
      newGoal.name,
      parseFloat(newGoal.targetAmount),
      newGoal.targetDate,
      parseFloat(newGoal.monthlySip)
    )
    
    if (newGoal.currentValue) {
      updateGoalProgress(newGoal.id, parseFloat(newGoal.currentValue))
    }
    
    toast.success('Goal created successfully')
    setOpen(false)
    setNewGoal({ name: '', targetAmount: '', targetDate: '', monthlySip: '', currentValue: '' })
  }
  
  const handleExportGoal = (goal, progress) => {
    exportGoalToPDF(goal, progress)
    toast.success('Goal report exported')
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Goal-Based Planning
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Goal
        </Button>
      </Box>
      
      {/* Expected Return Setting */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Expected Annual Return
        </Typography>
        <TextField
          type="number"
          value={expectedReturn}
          onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
          InputProps={{ endAdornment: '%' }}
          size="small"
          sx={{ width: 150 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Used for projecting goal achievement. Default is 12% based on historical equity fund returns.
        </Typography>
      </Paper>
      
      {/* Goals Grid */}
      <Grid container spacing={3}>
        {goals.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No goals created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create financial goals like Retirement, Child Education, or Home Purchase
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
              >
                Create Your First Goal
              </Button>
            </Paper>
          </Grid>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgress(
              goal.targetAmount,
              goal.currentValue,
              goal.monthlySip,
              expectedReturn,
              goal.targetDate
            )
            const progressPercent = Math.min(progress.progressPercentage, 100)
            
            return (
              <Grid item xs={12} md={6} key={goal.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {goal.name}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExportGoal(goal, progress)}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            removeGoal(goal.id)
                            toast.success('Goal removed')
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5, 
                        mb: 2,
                        backgroundColor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: progress.onTrack ? '#10b981' : '#f59e0b'
                        }
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {progressPercent.toFixed(1)}% Complete
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ₹{goal.currentValue.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Target Date
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({Math.ceil(progress.monthsRemaining)} months)
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Monthly SIP
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ₹{goal.monthlySip.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Projected Value (at {expectedReturn}% p.a.)
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color={progress.onTrack ? 'success.main' : 'warning.main'}>
                        ₹{progress.projectedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </Typography>
                      
                      {!progress.onTrack && progress.requiredSip > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="error" display="block">
                            Gap: ₹{progress.gap.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Required SIP: ₹{progress.requiredSip.toLocaleString('en-IN')}/month
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={progress.onTrack ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        label={progress.onTrack ? 'On Track' : 'Gap Identified'}
                        color={progress.onTrack ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        )}
      </Grid>
      
      {/* Create Goal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Goal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Goal Name"
                fullWidth
                required
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g., Retirement Corpus, Child Education"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Target Amount"
                type="number"
                fullWidth
                required
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="e.g., 10000000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Target Date"
                type="date"
                fullWidth
                required
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Monthly SIP"
                type="number"
                fullWidth
                required
                value={newGoal.monthlySip}
                onChange={(e) => setNewGoal({ ...newGoal, monthlySip: e.target.value })}
                placeholder="e.g., 10000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Value (if any)"
                type="number"
                fullWidth
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
                placeholder="e.g., 50000"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddGoal} variant="contained">
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
