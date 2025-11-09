'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  data?: any
  action?: string
  duration?: number
}

interface DocLoggerContextType {
  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
  exportToMarkdown: () => string
  downloadMarkdown: (filename?: string) => void
}

const DocLoggerContext = createContext<DocLoggerContextType | undefined>(undefined)

export function DocLoggerProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }
    setLogs(prev => [newLog, ...prev])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const exportToMarkdown = useCallback((): string => {
    const header = `# API360 Documentation Log
Generated on: ${new Date().toLocaleString()}

## Activity Log

`

    const markdownLogs = logs.map(log => {
      const emoji = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️'
      }[log.type]

      let entry = `### ${emoji} ${log.type.toUpperCase()}: ${log.message}`
      entry += `\n**Time:** ${new Date(log.timestamp).toLocaleString()}`

      if (log.action) {
        entry += `\n**Action:** \`${log.action}\``
      }

      if (log.duration) {
        entry += `\n**Duration:** ${log.duration}ms`
      }

      if (log.data) {
        entry += `\n**Data:**\n\`\`\`json\n${JSON.stringify(log.data, null, 2)}\n\`\`\``
      }

      entry += '\n---\n'
      return entry
    }).join('\n')

    return header + markdownLogs
  }, [logs])

  const downloadMarkdown = useCallback((filename = 'api360-docs') => {
    const markdown = exportToMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [exportToMarkdown])

  const value: DocLoggerContextType = {
    logs,
    addLog,
    clearLogs,
    exportToMarkdown,
    downloadMarkdown
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

// Export Button Component
export function ExportMarkdownButton({
  filename,
  className = ''
}: {
  filename?: string
  className?: string
}) {
  const { logs, exportToMarkdown, downloadMarkdown, clearLogs } = useDocLogger()

  if (logs.length === 0) {
    return null
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => downloadMarkdown(filename)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
      >
        📄 Export Markdown ({logs.length})
      </button>
      <button
        onClick={clearLogs}
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
      >
        🗑️ Clear
      </button>
    </div>
  )
}