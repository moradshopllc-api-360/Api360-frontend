'use client'

import React, { createContext, useContext, useCallback, useState } from 'react'
import { DocLoggerProvider, useDocLogger } from '@/lib/ai/doc-logger'
import type { ActionSpec } from '@/lib/ai/actions'

export interface WorkflowStep {
  id: string
  name: string
  spec: ActionSpec
  data?: any
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: any
  error?: string
  duration?: number
}

export interface AIWorkflowContextType {
  workflows: Map<string, WorkflowStep[]>
  createWorkflow: (name: string, steps: Array<{ name: string; spec: ActionSpec; data?: any }>) => string
  executeWorkflow: (workflowId: string) => Promise<void>
  getWorkflowStatus: (workflowId: string) => 'pending' | 'running' | 'completed' | 'error'
  clearWorkflow: (workflowId: string) => void
  clearAllWorkflows: () => void
}

const AIWorkflowContext = createContext<AIWorkflowContextType | undefined>(undefined)

function AIWorkflowProviderInner({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<Map<string, WorkflowStep[]>>(new Map())
  const { addLog } = useDocLogger()

  const createWorkflow = useCallback((
    name: string,
    steps: Array<{ name: string; spec: ActionSpec; data?: any }>
  ) => {
    const workflowId = Math.random().toString(36).substr(2, 9)
    const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
      id: `${workflowId}-${index}`,
      name: step.name,
      spec: step.spec,
      data: step.data,
      status: 'pending' as const
    }))

    setWorkflows(prev => {
      const newMap = new Map(prev)
      newMap.set(workflowId, workflowSteps)
      return newMap
    })

    addLog({
      type: 'info',
      message: `Created workflow "${name}" with ${steps.length} steps`,
      action: 'WORKFLOW_CREATE',
      data: { workflowId, name, stepCount: steps.length }
    })

    return workflowId
  }, [addLog])

  const executeWorkflow = useCallback(async (workflowId: string) => {
    const workflow = workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    const startTime = Date.now()

    addLog({
      type: 'info',
      message: `Starting workflow execution`,
      action: 'WORKFLOW_START',
      data: { workflowId, stepCount: workflow.length }
    })

    // Update workflow status to running
    setWorkflows(prev => {
      const newMap = new Map(prev)
      const updatedWorkflow = workflow.map(step => ({
        ...step,
        status: 'pending' as const
      }))
      newMap.set(workflowId, updatedWorkflow)
      return newMap
    })

    try {
      for (let i = 0; i < workflow.length; i++) {
        const step = workflow[i]
        const stepStartTime = Date.now()

        // Update step status to running
        setWorkflows(prev => {
          const newMap = new Map(prev)
          const currentWorkflow = newMap.get(workflowId) || []
          const updatedWorkflow = currentWorkflow.map(s =>
            s.id === step.id ? { ...s, status: 'running' as const } : s
          )
          newMap.set(workflowId, updatedWorkflow)
          return newMap
        })

        try {
          // Import apiFetch for centralized handling
          const { apiFetch } = await import('@/config/api-config')

          const fetchOptions: RequestInit = {
            method: step.spec.method,
          }

          // Add body for methods that support it
          if (step.data && ['POST', 'PUT', 'PATCH'].includes(step.spec.method)) {
            fetchOptions.body = JSON.stringify(step.data)
          }

          const response = await apiFetch(step.spec.path, fetchOptions)

          const stepDuration = Date.now() - stepStartTime
          let result: any

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }

          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            result = await response.json()
          } else if (contentType?.includes('text/')) {
            result = await response.text()
          } else {
            result = await response.blob()
          }

          // Update step status to completed
          setWorkflows(prev => {
            const newMap = new Map(prev)
            const currentWorkflow = newMap.get(workflowId) || []
            const updatedWorkflow = currentWorkflow.map(s =>
              s.id === step.id ? {
                ...s,
                status: 'completed' as const,
                result,
                duration: stepDuration
              } : s
            )
            newMap.set(workflowId, updatedWorkflow)
            return newMap
          })

          addLog({
            type: 'success',
            message: `Workflow step completed: ${step.name}`,
            action: 'WORKFLOW_STEP_COMPLETE',
            data: { workflowId, stepId: step.id, stepName: step.name, result },
            duration: stepDuration
          })

        } catch (error) {
          const stepDuration = Date.now() - stepStartTime
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'

          // Update step status to error
          setWorkflows(prev => {
            const newMap = new Map(prev)
            const currentWorkflow = newMap.get(workflowId) || []
            const updatedWorkflow = currentWorkflow.map(s =>
              s.id === step.id ? {
                ...s,
                status: 'error' as const,
                error: errorMessage,
                duration: stepDuration
              } : s
            )
            newMap.set(workflowId, updatedWorkflow)
            return newMap
          })

          addLog({
            type: 'error',
            message: `Workflow step failed: ${step.name}`,
            action: 'WORKFLOW_STEP_ERROR',
            data: { workflowId, stepId: step.id, stepName: step.name, error: errorMessage },
            duration: stepDuration
          })

          throw error
        }
      }

      const totalDuration = Date.now() - startTime

      addLog({
        type: 'success',
        message: `Workflow completed successfully`,
        action: 'WORKFLOW_COMPLETE',
        data: { workflowId, stepCount: workflow.length },
        duration: totalDuration
      })

    } catch (error) {
      const totalDuration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      addLog({
        type: 'error',
        message: `Workflow failed: ${errorMessage}`,
        action: 'WORKFLOW_ERROR',
        data: { workflowId, error: errorMessage },
        duration: totalDuration
      })

      throw error
    }
  }, [workflows, addLog])

  const getWorkflowStatus = useCallback((workflowId: string): 'pending' | 'running' | 'completed' | 'error' => {
    const workflow = workflows.get(workflowId)
    if (!workflow) return 'pending'

    const statuses = workflow.map(step => step.status)

    if (statuses.every(status => status === 'pending')) return 'pending'
    if (statuses.some(status => status === 'running')) return 'running'
    if (statuses.some(status => status === 'error')) return 'error'
    return 'completed'
  }, [workflows])

  const clearWorkflow = useCallback((workflowId: string) => {
    setWorkflows(prev => {
      const newMap = new Map(prev)
      newMap.delete(workflowId)
      return newMap
    })

    addLog({
      type: 'info',
      message: `Cleared workflow`,
      action: 'WORKFLOW_CLEAR',
      data: { workflowId }
    })
  }, [addLog])

  const clearAllWorkflows = useCallback(() => {
    setWorkflows(new Map())

    addLog({
      type: 'info',
      message: `Cleared all workflows`,
      action: 'WORKFLOW_CLEAR_ALL'
    })
  }, [addLog])

  const value: AIWorkflowContextType = {
    workflows,
    createWorkflow,
    executeWorkflow,
    getWorkflowStatus,
    clearWorkflow,
    clearAllWorkflows
  }

  return (
    <AIWorkflowContext.Provider value={value}>
      {children}
    </AIWorkflowContext.Provider>
  )
}

export function AIWorkflowProvider({ children }: { children: React.ReactNode }) {
  return (
    <DocLoggerProvider>
      <AIWorkflowProviderInner>
        {children}
      </AIWorkflowProviderInner>
    </DocLoggerProvider>
  )
}

export function useAIWorkflow() {
  const context = useContext(AIWorkflowContext)
  if (context === undefined) {
    throw new Error('useAIWorkflow must be used within an AIWorkflowProvider')
  }
  return context
}

// Hook for creating and executing workflows with a simpler API
export function useSimpleWorkflow() {
  const { createWorkflow, executeWorkflow, getWorkflowStatus } = useAIWorkflow()
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)

  const runWorkflow = useCallback(async (
    name: string,
    steps: Array<{ name: string; spec: ActionSpec; data?: any }>
  ) => {
    const workflowId = createWorkflow(name, steps)
    setCurrentWorkflowId(workflowId)

    try {
      await executeWorkflow(workflowId)
      return { success: true, workflowId }
    } catch (error) {
      return {
        success: false,
        workflowId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [createWorkflow, executeWorkflow])

  const status = currentWorkflowId ? getWorkflowStatus(currentWorkflowId) : 'pending'

  return {
    runWorkflow,
    currentWorkflowId,
    status,
    isRunning: status === 'running',
    isCompleted: status === 'completed',
    hasError: status === 'error'
  }
}