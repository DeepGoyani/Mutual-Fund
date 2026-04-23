'use client'

import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DeleteIcon from '@mui/icons-material/Delete'
import AddAlertIcon from '@mui/icons-material/AddAlert'
import toast from 'react-hot-toast'

export default function AlertManager() {
  const { alerts, addAlert, removeAlert, markAlertTriggered, watchlist } = usePortfolioStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [newAlert, setNewAlert] = useState({
    code: '',
    type: 'price_above',
    value: ''
  })
  const [triggeredAlerts, setTriggeredAlerts] = useState([])
  
  const open = Boolean(anchorEl)
  
  // Check alerts against current prices
  useEffect(() => {
    const checkAlerts = async () => {
      const newlyTriggered = []
      
      for (const alert of alerts.filter(a => !a.triggered)) {
        try {
          const res = await fetch(`https://api.mfapi.in/mf/${alert.code}`)
          if (res.ok) {
            const data = await res.json()
            const currentNav = parseFloat(data?.data?.[0]?.nav)
            
            if (alert.type === 'price_above' && currentNav >= alert.value) {
              markAlertTriggered(alert.id)
              newlyTriggered.push({ ...alert, currentNav, triggeredAt: new Date() })
            } else if (alert.type === 'price_below' && currentNav <= alert.value) {
              markAlertTriggered(alert.id)
              newlyTriggered.push({ ...alert, currentNav, triggeredAt: new Date() })
            }
          }
        } catch (e) {
          console.error(`Failed to check alert for ${alert.code}`)
        }
      }
      
      if (newlyTriggered.length > 0) {
        setTriggeredAlerts(prev => [...newlyTriggered, ...prev].slice(0, 10))
        newlyTriggered.forEach(alert => {
          toast.success(`Alert triggered: ${alert.code} ${alert.type.replace('_', ' ')} ₹${alert.value}`, {
            duration: 5000
          })
        })
      }
    }
    
    checkAlerts()
    const interval = setInterval(checkAlerts, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [alerts, markAlertTriggered])
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleAddAlert = () => {
    if (!newAlert.code || !newAlert.value) {
      toast.error('Please fill all fields')
      return
    }
    
    addAlert(newAlert.code, newAlert.type, parseFloat(newAlert.value))
    toast.success('Alert created successfully')
    setOpenDialog(false)
    setNewAlert({ code: '', type: 'price_above', value: '' })
  }
  
  const activeAlerts = alerts.filter(a => !a.triggered)
  
  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={activeAlerts.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 400, maxHeight: 500 } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Price Alerts
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeAlerts.length} active, {alerts.filter(a => a.triggered).length} triggered
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <>
            <Box sx={{ px: 2, py: 1, backgroundColor: '#fef3c7' }}>
              <Typography variant="caption" fontWeight="bold" color="warning.main">
                Recently Triggered
              </Typography>
            </Box>
            {triggeredAlerts.slice(0, 3).map((alert, idx) => (
              <MenuItem key={idx} dense>
                <ListItemText
                  primary={`${alert.code}`}
                  secondary={`${alert.type.replace('_', ' ')} ₹${alert.value} (Now: ₹${alert.currentNav})`}
                />
                <Chip size="small" label="Triggered" color="success" />
              </MenuItem>
            ))}
            <Divider />
          </>
        )}
        
        {/* Active Alerts */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" fontWeight="bold">
            Active Alerts
          </Typography>
        </Box>
        
        {activeAlerts.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              No active alerts
            </Typography>
          </Box>
        ) : (
          <List dense>
            {activeAlerts.map((alert) => (
              <ListItem
                key={alert.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => {
                      removeAlert(alert.id)
                      toast.success('Alert removed')
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={alert.code}
                  secondary={`${alert.type.replace('_', ' ')} ₹${alert.value}`}
                />
              </ListItem>
            ))}
          </List>
        )}
        
        <Divider />
        
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            startIcon={<AddAlertIcon />}
            onClick={() => {
              handleClose()
              setOpenDialog(true)
            }}
          >
            Create Alert
          </Button>
        </Box>
      </Menu>
      
      {/* Create Alert Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Price Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Fund</InputLabel>
              <Select
                value={newAlert.code}
                label="Fund"
                onChange={(e) => setNewAlert({ ...newAlert, code: e.target.value })}
              >
                {watchlist.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Alert Type</InputLabel>
              <Select
                value={newAlert.type}
                label="Alert Type"
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
              >
                <MenuItem value="price_above">Price Goes Above</MenuItem>
                <MenuItem value="price_below">Price Goes Below</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Target NAV"
              type="number"
              fullWidth
              value={newAlert.value}
              onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
              placeholder="e.g., 25.50"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAlert} variant="contained">
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
