import { useState, useEffect } from 'react'

interface OfflineData {
  id: string
  type: 'quiz_submission' | 'study_session' | 'social_activity'
  data: any
  timestamp: number
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check for pending offline data
    const checkPendingData = () => {
      try {
        const pendingData = localStorage.getItem('offlineData')
        if (pendingData) {
          const data: OfflineData[] = JSON.parse(pendingData)
          setPendingCount(data.length)
        } else {
          setPendingCount(0)
        }
      } catch (error) {
        console.error('Error checking pending data:', error)
        setPendingCount(0)
      }
    }

    checkPendingData()

    // Set up interval to check pending data
    const interval = setInterval(checkPendingData, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Add data to offline queue
  const addOfflineData = (type: OfflineData['type'], data: any) => {
    try {
      const pendingData = localStorage.getItem('offlineData')
      const existingData: OfflineData[] = pendingData ? JSON.parse(pendingData) : []
      
      const newData: OfflineData = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now()
      }
      
      existingData.push(newData)
      localStorage.setItem('offlineData', JSON.stringify(existingData))
      setPendingCount(existingData.length)
    } catch (error) {
      console.error('Error adding offline data:', error)
    }
  }

  // Sync pending data when back online
  const syncPendingData = async () => {
    if (!isOnline) return

    try {
      const pendingData = localStorage.getItem('offlineData')
      if (!pendingData) return

      const data: OfflineData[] = JSON.parse(pendingData)
      if (data.length === 0) return

      const syncedData: OfflineData[] = []

      for (const item of data) {
        try {
          // Attempt to sync each item
          switch (item.type) {
            case 'quiz_submission':
              await fetch('/api/quiz-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              })
              break
            case 'study_session':
              await fetch('/api/study-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              })
              break
            case 'social_activity':
              await fetch('/api/social-activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.data)
              })
              break
          }
        } catch (error) {
          console.error(`Error syncing ${item.type}:`, error)
          syncedData.push(item) // Keep failed items for retry
        }
      }

      // Update localStorage with remaining unsynced data
      localStorage.setItem('offlineData', JSON.stringify(syncedData))
      setPendingCount(syncedData.length)
    } catch (error) {
      console.error('Error syncing pending data:', error)
    }
  }

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncPendingData()
    }
  }, [isOnline, pendingCount])

  return {
    isOnline,
    pendingCount,
    addOfflineData,
    syncPendingData
  }
} 