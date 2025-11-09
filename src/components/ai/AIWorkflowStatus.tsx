'use client'

import React, { useState, useEffect } from 'react'
import { useDocLogger } from '@/lib/ai/doc-logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Activity,
  Clock,
  Zap
} from 'lucide-react'

interface AIWorkflowStatusProps {
  maxEntries?: number
  showActions?: boolean
  className?: string
}

export function AIWorkflowStatus({
  maxEntries = 10,
  showActions = true,
  className = ''
}: AIWorkflowStatusProps) {
  const { logs, clearLogs } = useDocLogger()
  const [isExpanded, setIsExpanded] = useState(false)
  const [liveUpdates, setLiveUpdates] = useState(true)

  const recentLogs = logs.slice(-maxEntries).reverse()

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return ''
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const formatTime = (timestamp: Date | string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const stats = {
    total: logs.length,
    success: logs.filter(log => log.type === 'success').length,
    errors: logs.filter(log => log.type === 'error').length,
    warnings: logs.filter(log => log.type === 'warning').length,
    avgDuration: logs.filter(log => log.duration).reduce((acc, log) => acc + (log.duration || 0), 0) / logs.filter(log => log.duration).length || 0
  }

  if (logs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI360 Workflow Status
          </CardTitle>
          <CardDescription>
            No AI360 workflow activities yet. Start using AI-powered features to see live updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Waiting for AI360 activities...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle className="text-lg">AI360 Workflow Status</CardTitle>
            {liveUpdates && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {logs.length} actions
            </Badge>
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatDuration(stats.avgDuration)}
            </div>
            <p className="text-xs text-muted-foreground">Avg Time</p>
          </div>
        </div>
      </CardHeader>

      {(isExpanded || !showActions) && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiveUpdates(!liveUpdates)}
                className="text-xs"
              >
                {liveUpdates ? 'Pause' : 'Resume'} Updates
              </Button>
              {showActions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLogs}
                  className="text-xs"
                >
                  Clear Logs
                </Button>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Showing last {Math.min(maxEntries, recentLogs.length)} activities
            </span>
          </div>

          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4 space-y-3">
              {recentLogs.map((log, index) => (
                <div key={log.id} className="space-y-2">
                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusColor(log.type)}`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(log.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{log.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(log.timestamp)}
                        </div>
                      </div>

                      <p className="text-xs font-mono text-muted-foreground mb-2">
                        {log.action}
                      </p>

                      {log.duration && (
                        <div className="flex items-center gap-1 text-xs">
                          <Zap className="h-3 w-3" />
                          <span>Duration: {formatDuration(log.duration)}</span>
                        </div>
                      )}

                      {log.data && Object.keys(log.data).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer hover:underline">
                            View Data
                          </summary>
                          <pre className="mt-1 text-xs bg-black/5 rounded p-2 overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  {index < recentLogs.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  )
}