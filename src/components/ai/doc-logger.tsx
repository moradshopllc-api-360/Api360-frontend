'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ActionSpec } from '@/lib/ai/actions'

interface LogEntry {
  id: string
  timestamp: Date
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  action: string
  data?: any
  duration?: number
}

interface DocLoggerContextType {
  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
  exportLogs: () => string
}

const DocLoggerContext = createContext<DocLoggerContextType | undefined>(undefined)

export function DocLoggerProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const logEntry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      ...entry
    }

    setLogs(prev => [...prev, logEntry])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const exportLogs = useCallback(() => {
    const markdown = logs.map(log => {
      const header = `## ${log.message}`
      const timestamp = `**Timestamp:** ${log.timestamp.toISOString()}`
      const type = `**Type:** ${log.type.toUpperCase()}`
      const action = `**Action:** ${log.action}`

      let details = ''

      if (log.duration) {
        details += `**Duration:** ${log.duration}ms\n\n`
      }

      if (log.data) {
        details += `**Data:**\n\`\`\`json\n${JSON.stringify(log.data, null, 2)}\n\`\`\`\n\n`
      }

      return `${header}\n\n${timestamp}\n\n${type}\n\n${action}\n\n${details}---\n`
    }).join('\n')

    return `# AI360 Workflow Logs\n\nGenerated on: ${new Date().toISOString()}\n\n${markdown}`
  }, [logs])

  const value: DocLoggerContextType = {
    logs,
    addLog,
    clearLogs,
    exportLogs
  }

  return (
    <DocLoggerContext.Provider value={value}>
      {children}
    </DocLoggerContext.Provider>
  )
}

export function useDocLogger() {
  const context = useContext(DocLoggerContext)
  if (context === undefined) {
    throw new Error('useDocLogger must be used within a DocLoggerProvider')
  }
  return context
}

// Export button component
export function ExportMarkdownButton() {
  const { exportLogs, logs } = useDocLogger()

  if (logs.length === 0) {
    return null
  }

  const handleExport = () => {
    const markdown = exportLogs()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-workflow-logs-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors font-medium"
    >
      📄 Export AI360 Logs ({logs.length})
    </button>
  )
}