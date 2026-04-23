import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      // Portfolio holdings: [{ code, name, units, avgNav, investedDate, transactions: [] }]
      holdings: [],
      
      // Watchlist: [{ code, name, addedDate }]
      watchlist: [],
      
      // Alerts: [{ id, code, type: 'price_above'|'price_below', value, triggered }]
      alerts: [],
      
      // Goals: [{ id, name, targetAmount, targetDate, monthlySip, currentValue }]
      goals: [],

      addHolding: (code, name, units, nav, date) => {
        const holdings = get().holdings
        const existing = holdings.find(h => h.code === code)
        
        if (existing) {
          // Update existing holding with new units (average NAV calculation)
          const totalUnits = existing.units + units
          const totalInvested = (existing.units * existing.avgNav) + (units * nav)
          const newAvgNav = totalInvested / totalUnits
          
          set({
            holdings: holdings.map(h =>
              h.code === code
                ? {
                    ...h,
                    units: totalUnits,
                    avgNav: newAvgNav,
                    transactions: [...h.transactions, { units, nav, date, type: 'buy' }]
                  }
                : h
            )
          })
        } else {
          set({
            holdings: [
              ...holdings,
              {
                code,
                name,
                units,
                avgNav: nav,
                investedDate: date,
                transactions: [{ units, nav, date, type: 'buy' }]
              }
            ]
          })
        }
      },

      removeHolding: (code) => {
        set({ holdings: get().holdings.filter(h => h.code !== code) })
      },

      updateHoldingValue: (code, currentNav) => {
        set({
          holdings: get().holdings.map(h =>
            h.code === code ? { ...h, currentNav } : h
          )
        })
      },

      addToWatchlist: (code, name) => {
        const exists = get().watchlist.find(w => w.code === code)
        if (!exists) {
          set({
            watchlist: [...get().watchlist, { code, name, addedDate: new Date().toISOString() }]
          })
        }
      },

      removeFromWatchlist: (code) => {
        set({ watchlist: get().watchlist.filter(w => w.code !== code) })
      },

      addAlert: (code, type, value) => {
        const id = `${code}-${type}-${Date.now()}`
        set({
          alerts: [...get().alerts, { id, code, type, value, triggered: false, createdAt: new Date().toISOString() }]
        })
        return id
      },

      removeAlert: (id) => {
        set({ alerts: get().alerts.filter(a => a.id !== id) })
      },

      markAlertTriggered: (id) => {
        set({
          alerts: get().alerts.map(a =>
            a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a
          )
        })
      },

      addGoal: (name, targetAmount, targetDate, monthlySip) => {
        const id = `goal-${Date.now()}`
        set({
          goals: [...get().goals, {
            id,
            name,
            targetAmount,
            targetDate,
            monthlySip,
            currentValue: 0,
            createdAt: new Date().toISOString()
          }]
        })
        return id
      },

      removeGoal: (id) => {
        set({ goals: get().goals.filter(g => g.id !== id) })
      },

      updateGoalProgress: (id, currentValue) => {
        set({
          goals: get().goals.map(g =>
            g.id === id ? { ...g, currentValue } : g
          )
        })
      },

      getPortfolioSummary: () => {
        const holdings = get().holdings
        const totalInvested = holdings.reduce((sum, h) => sum + (h.units * h.avgNav), 0)
        const currentValue = holdings.reduce((sum, h) => sum + (h.units * (h.currentNav || h.avgNav)), 0)
        const totalReturn = currentValue - totalInvested
        const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

        return {
          totalInvested,
          currentValue,
          totalReturn,
          returnPercentage,
          holdingsCount: holdings.length
        }
      }
    }),
    {
      name: 'mutual-fund-portfolio',
      version: 1
    }
  )
)
