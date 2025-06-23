import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { API_ROUTES } from '@/lib/routes'

interface StudySession {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  course: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  reminders: boolean
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Local storage helpers
  const saveToStorage = useCallback((data: StudySession[]) => {
    try {
      localStorage.setItem('study-sessions', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }, [])

  const loadFromStorage = useCallback((): StudySession[] => {
    try {
      const stored = localStorage.getItem('study-sessions')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return []
    }
  }, [])

  // Fetch sessions from API with fallback
  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(API_ROUTES.SESSIONS)
      if (!response.ok) throw new Error('Failed to fetch sessions')
      
      const data = await response.json()
      setSessions(data)
      saveToStorage(data)
      setIsOnline(true)
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error)
      const storedData = loadFromStorage()
      setSessions(storedData)
      setIsOnline(false)
      
      if (storedData.length === 0) {
        setError('No data available offline')
      } else {
        toast({
          title: "Offline Mode",
          description: "Using cached data. Some features may be limited.",
          variant: "default",
        })
      }
    } finally {
      setLoading(false)
    }
  }, [loadFromStorage, saveToStorage, toast])

  // Add session
  const addSession = useCallback(async (sessionData: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isOnline) {
      try {
        const response = await fetch(API_ROUTES.SESSIONS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        })
        
        if (!response.ok) throw new Error('Failed to add session')
        
        const savedSession = await response.json()
        setSessions(prev => [...prev, savedSession])
        saveToStorage([...sessions, savedSession])
        
        toast({
          title: "Success",
          description: "Study session added successfully!",
        })
        return savedSession
      } catch (error) {
        console.warn('API failed, saving locally:', error)
      }
    }

    // Fallback to localStorage
    const updatedSessions = [...sessions, newSession]
    setSessions(updatedSessions)
    saveToStorage(updatedSessions)
    
    toast({
      title: "Session Added",
      description: "Session saved locally (offline mode)",
    })
    
    return newSession
  }, [sessions, isOnline, saveToStorage, toast])

  // Update session
  const updateSession = useCallback(async (id: string, updates: Partial<StudySession>) => {
    const updatedSession = { ...updates, id, updatedAt: new Date().toISOString() }
    
    if (isOnline) {
      try {
        const response = await fetch(`${API_ROUTES.SESSIONS}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        
        if (!response.ok) throw new Error('Failed to update session')
        
        const savedSession = await response.json()
        const updatedSessions = sessions.map(s => s.id === id ? savedSession : s)
        setSessions(updatedSessions)
        saveToStorage(updatedSessions)
        
        toast({
          title: "Success",
          description: "Study session updated successfully!",
        })
        return savedSession
      } catch (error) {
        console.warn('API failed, updating locally:', error)
      }
    }

    // Fallback to localStorage
    const updatedSessions = sessions.map(s => s.id === id ? { ...s, ...updatedSession } : s)
    setSessions(updatedSessions)
    saveToStorage(updatedSessions)
    
    toast({
      title: "Session Updated",
      description: "Session updated locally (offline mode)",
    })
    
    return updatedSession
  }, [sessions, isOnline, saveToStorage, toast])

  // Delete session
  const deleteSession = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_ROUTES.SESSIONS}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete session')
        
        const updatedSessions = sessions.filter(s => s.id !== id)
        setSessions(updatedSessions)
        saveToStorage(updatedSessions)
        
        toast({
          title: "Success",
          description: "Study session deleted successfully!",
        })
        return true
      } catch (error) {
        console.warn('API failed, deleting locally:', error)
      }
    }

    // Fallback to localStorage
    const updatedSessions = sessions.filter(s => s.id !== id)
    setSessions(updatedSessions)
    saveToStorage(updatedSessions)
    
    toast({
      title: "Session Deleted",
      description: "Session deleted locally (offline mode)",
    })
    
    return true
  }, [sessions, isOnline, saveToStorage, toast])

  // Initial load
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return {
    sessions,
    loading,
    error,
    isOnline,
    addSession,
    updateSession,
    deleteSession,
    refetch: fetchSessions,
  }
} 