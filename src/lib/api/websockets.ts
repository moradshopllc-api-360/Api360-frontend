'use client'

import { apiClient } from './client'
import type { WebSocketMessage, WebSocketAuth } from '@/types/api'

export interface WebSocketOptions {
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  options: WebSocketOptions
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private isConnecting = false
  private messageQueue: WebSocketMessage[] = []
  private subscribers: Map<string, Set<(message: WebSocketMessage) => void>> = new Map()

  constructor(options: WebSocketOptions = {}) {
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...options
    }
  }

  connect(path: string = '/ws'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        // Wait for existing connection
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve()
          } else if (this.ws?.readyState === WebSocket.CLOSED) {
            reject(new Error('Connection failed'))
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
        return
      }

      this.isConnecting = true

      try {
        this.ws = apiClient.createWebSocket(path)

        if (!this.ws) {
          this.isConnecting = false
          reject(new Error('Failed to create WebSocket connection'))
          return
        }

        this.ws.onopen = (event) => {
          this.isConnecting = false
          this.reconnectAttempts = 0
          console.log('WebSocket connected')

          // Send queued messages
          this.flushMessageQueue()

          this.options.onOpen?.(event)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onerror = (event) => {
          this.isConnecting = false
          console.error('WebSocket error:', event)
          this.options.onError?.(event)
          reject(new Error('WebSocket connection error'))
        }

        this.ws.onclose = (event) => {
          this.isConnecting = false
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.options.onClose?.(event)

          // Attempt to reconnect if enabled and not a normal closure
          if (this.options.reconnect && event.code !== 1000) {
            this.scheduleReconnect()
          }
        }

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }

    this.messageQueue = []
    this.subscribers.clear()
  }

  send(message: Omit<WebSocketMessage, 'timestamp' | 'id'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: new Date().toISOString(),
      id: this.generateMessageId()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage))
    } else {
      // Queue message for later
      this.messageQueue.push(fullMessage)
    }
  }

  subscribe(type: string, callback: (message: WebSocketMessage) => void): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set())
    }

    this.subscribers.get(type)!.add(callback)

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(type)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(type)
        }
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    // Notify subscribers
    const subscribers = this.subscribers.get(message.type)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(message)
        } catch (error) {
          console.error('Error in WebSocket subscriber:', error)
        }
      })
    }

    // Notify global message handler
    this.options.onMessage?.(message)
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()!
      this.ws.send(JSON.stringify(message))
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.options.maxReconnectAttempts || 5)) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = (this.options.reconnectInterval || 3000) * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`)

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get isConnectingOrConnected(): boolean {
    return this.isConnecting || this.isConnected
  }
}

// Specialized WebSocket services

export class NotificationWebSocket extends WebSocketManager {
  constructor() {
    super({
      onMessage: (message) => {
        if (message.type === 'notification') {
          // Handle notifications
          this.handleNotification(message.data)
        }
      }
    })
  }

  private handleNotification(data: any): void {
    // Show browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title || 'New Notification', {
        body: data.body,
        icon: '/favicon.ico',
        tag: data.id
      })
    }

    // You can also integrate with a toast notification system here
    console.log('Notification received:', data)
  }

  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }
}

export class ActivityWebSocket extends WebSocketManager {
  constructor() {
    super({
      onMessage: (message) => {
        if (message.type === 'activity') {
          // Handle real-time activity updates
          this.handleActivityUpdate(message.data)
        }
      }
    })
  }

  private handleActivityUpdate(data: any): void {
    // Dispatch custom event for other parts of the app to listen to
    window.dispatchEvent(new CustomEvent('activity-update', {
      detail: data
    }))
  }
}

// Create singleton instances
export const notificationWs = new NotificationWebSocket()
export const activityWs = new ActivityWebSocket()

// React hooks for WebSocket integration
import { useEffect, useRef, useState } from 'react'

export function useWebSocket(manager: WebSocketManager, path?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const managerRef = useRef(manager)

  useEffect(() => {
    const currentManager = managerRef.current

    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    // Subscribe to connection events
    currentManager.options.onOpen = handleConnect
    currentManager.options.onClose = handleDisconnect

    // Connect if not already connected
    if (!currentManager.isConnectingOrConnected) {
      currentManager.connect(path).catch(console.error)
    }

    // Cleanup on unmount
    return () => {
      // Don't disconnect here as it might be used by other components
      // Instead, just remove our event handlers
      currentManager.options.onOpen = undefined
      currentManager.options.onClose = undefined
    }
  }, [path])

  return {
    isConnected,
    manager: managerRef.current,
    send: (message: any) => managerRef.current.send(message),
    subscribe: (type: string, callback: (message: WebSocketMessage) => void) =>
      managerRef.current.subscribe(type, callback)
  }
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([])

  const { isConnected, manager } = useWebSocket(notificationWs)

  useEffect(() => {
    const unsubscribe = manager.subscribe('notification', (message) => {
      setNotifications(prev => [...prev, message])
    })

    return unsubscribe
  }, [manager])

  return {
    isConnected,
    notifications,
    clearNotifications: () => setNotifications([]),
    markAsRead: (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }
}