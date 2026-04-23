'use client'

import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function WatchlistButton() {
  const { watchlist, removeFromWatchlist } = usePortfolioStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNavs, setCurrentNavs] = useState({})
  
  const open = Boolean(anchorEl)
  
  // Fetch current NAVs for watchlist items
  useEffect(() => {
    const fetchNavs = async () => {
      const navs = {}
      for (const item of watchlist) {
        try {
          const res = await fetch(`https://api.mfapi.in/mf/${item.code}`)
          if (res.ok) {
            const data = await res.json()
            navs[item.code] = {
              nav: parseFloat(data?.data?.[0]?.nav),
              date: data?.data?.[0]?.date
            }
          }
        } catch (e) {
          console.error(`Failed to fetch NAV for ${item.code}`)
        }
      }
      setCurrentNavs(navs)
    }
    
    if (watchlist.length > 0) {
      fetchNavs()
      const interval = setInterval(fetchNavs, 60000)
      return () => clearInterval(interval)
    }
  }, [watchlist])
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleRemove = (code) => {
    removeFromWatchlist(code)
    toast.success('Removed from watchlist')
  }
  
  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="watchlist"
      >
        <Badge badgeContent={watchlist.length} color="primary">
          <StarIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 400 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Watchlist
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {watchlist.length} funds tracked
          </Typography>
        </Box>
        
        <Divider />
        
        {watchlist.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              No funds in watchlist
            </Typography>
            <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 1 }}>
              Add funds to track their performance
            </Typography>
          </Box>
        ) : (
          watchlist.map((item) => (
            <MenuItem key={item.code} sx={{ py: 1.5 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Link 
                  href={`/learn/fund/${item.code}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={handleClose}
                >
                  <Typography variant="body2" fontWeight="medium" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.code}
                  </Typography>
                  {currentNavs[item.code] && (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        ₹{currentNavs[item.code].nav?.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentNavs[item.code].date}
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Box>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(item.code)
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
        
        {watchlist.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                size="small"
                component={Link}
                href="/portfolio"
                onClick={handleClose}
              >
                View Portfolio
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  )
}

// Component to add/remove individual funds from watchlist
export function AddToWatchlistButton({ code, name, size = 'small' }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = usePortfolioStore()
  const isInWatchlist = watchlist.some(w => w.code === code)
  
  const handleToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(code)
      toast.success('Removed from watchlist')
    } else {
      addToWatchlist(code, name)
      toast.success('Added to watchlist')
    }
  }
  
  return (
    <IconButton 
      onClick={handleToggle}
      size={size}
      color={isInWatchlist ? 'primary' : 'default'}
      aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  )
}
