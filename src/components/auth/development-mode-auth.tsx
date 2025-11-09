"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function DevelopmentModeAuth() {
  const { isDevelopmentMode, signOut } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  // Cargar estado persistido desde localStorage al montar el componente
  useEffect(() => {
    const savedVisibility = localStorage.getItem('dev-mode-visible')
    if (savedVisibility !== null) {
      setIsVisible(savedVisibility === 'true')
    }
  }, [])

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('dev-mode-visible', isVisible.toString())
  }, [isVisible])

  if (!isDevelopmentMode) return null

  const handleMockAuth = (role: 'admin' | 'manager' | 'crew') => {
    // Set a mock user in localStorage for development
    const mockUser = {
      id: 'dev-user-id',
      email: `dev-${role}@api360.com`,
      name: `Development ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role.toUpperCase(),
      created_at: new Date().toISOString()
    }

    localStorage.setItem('dev-user', JSON.stringify(mockUser))
    window.location.reload()
  }

  const handleSignOut = async () => {
    console.log("🚀 [API360 DevMode] Development mode sign out initiated...")

    // Clear development mode specific data
    localStorage.removeItem('dev-user')
    localStorage.removeItem('dev-mode-visible')

    // Call the main auth context sign out for complete cleanup
    await signOut()

    // Force page reload to ensure clean state
    window.location.href = '/auth/login'
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Contenedor principal que mantiene la posición visual */}
      <div
        className={`
          bg-yellow-50 dark:bg-yellow-900/90
          border border-yellow-200 dark:border-yellow-700
          rounded-lg shadow-lg p-4 max-w-xs
          transition-all duration-300 ease-in-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
            🚀 Development Mode
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-lg leading-none"
              title={isExpanded ? "Collapse options" : "Expand options"}
            >
              {isExpanded ? '−' : '+'}
            </button>
            <button
              onClick={toggleVisibility}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-lg leading-none"
              title={isVisible ? "Hide development mode" : "Show development mode"}
            >
              {isVisible ? '✕' : '👁️'}
            </button>
          </div>
        </div>

        <div className={`
          transition-all duration-300 ease-in-out
          ${isVisible ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
        `}>
          <p className="text-yellow-700 dark:text-yellow-300 text-xs mb-3">
            Authentication bypassed for development
          </p>
        </div>

        {isExpanded && isVisible && (
          <div className="
            space-y-2
            animate-in slide-in-from-top-2
            transition-all duration-300 ease-in-out
          ">
            <p className="text-yellow-700 dark:text-yellow-300 text-xs font-medium">
              Mock Authentication:
            </p>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleMockAuth('admin')}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
              >
                Login as Admin
              </button>
              <button
                onClick={() => handleMockAuth('manager')}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
              >
                Login as Manager
              </button>
              <button
                onClick={() => handleMockAuth('crew')}
                className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
              >
                Login as Crew Member
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón flotante para mostrar cuando está oculto */}
      {!isVisible && (
        <button
          onClick={toggleVisibility}
          className="
            absolute bottom-0 left-0
            bg-yellow-500 dark:bg-yellow-600
            hover:bg-yellow-600 dark:hover:bg-yellow-700
            text-white rounded-full p-2
            shadow-lg transition-all duration-300 ease-in-out
            hover:scale-110
            animate-pulse
          "
          title="Show development mode"
        >
          <span className="text-sm">🚀</span>
        </button>
      )}
    </div>
  )
}