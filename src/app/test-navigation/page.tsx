'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAIAutowire } from '@/hooks/use-ai-autowire'
import { actions } from '@/lib/ai/actions'
import { useDocLogger } from '@/lib/ai/doc-logger'
import { DocLoggerProvider } from '@/lib/ai/doc-logger'

function TestNavigationComponent() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isTestRunning, setIsTestRunning] = useState(false)
  const { addLog } = useDocLogger()

  // Initialize AI autowire for navigation testing
  const { execute: executeNavigation, loading, error, response } = useAIAutowire({
    onSuccess: (data) => {
      const result = `✅ Navigation successful: ${JSON.stringify(data, null, 2)}`
      setTestResults(prev => [...prev, result])
      addLog({
        type: 'success',
        message: 'Test navigation executed successfully',
        action: 'Test Navigation',
        data
      })
    },
    onError: (error) => {
      const result = `❌ Navigation failed: ${error.message}`
      setTestResults(prev => [...prev, result])
      addLog({
        type: 'error',
        message: `Test navigation failed: ${error.message}`,
        action: 'Test Navigation',
        data: { error: error.message }
      })
    }
  })

  const runNavigationTest = async () => {
    setIsTestRunning(true)
    setTestResults([])

    try {
      // Test the navigation action
      await executeNavigation(actions.navigation.autoRedirect, {
        test_mode: true,
        trigger: 'test_button',
        reason: 'Testing AI360 navigation system'
      })
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setIsTestRunning(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI360 Navigation Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Test the navigation system without network errors
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>
                Test the AI360 navigation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runNavigationTest}
                disabled={isTestRunning}
                className="w-full"
              >
                {isTestRunning ? 'Testing...' : 'Test Navigation'}
              </Button>

              <Button
                variant="outline"
                onClick={clearResults}
                className="w-full"
              >
                Clear Results
              </Button>

              <div className="text-sm text-muted-foreground">
                <p><strong>ActionSpec:</strong></p>
                <p>Method: {actions.navigation.autoRedirect.method}</p>
                <p>Path: {actions.navigation.autoRedirect.path}</p>
                <p>Type: {actions.navigation.autoRedirect.method === 'NAVIGATE' ? 'Navigation (no API call)' : 'API Call'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Real-time test execution results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tests run yet</p>
                ) : (
                  testResults.map((result, index) => (
                    <pre key={index} className="text-xs bg-muted p-2 rounded">
                      {result}
                    </pre>
                  ))
                )}
              </div>

              {loading && (
                <div className="mt-4 text-sm text-blue-600">
                  🔄 Navigation test in progress...
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-red-600">
                  💥 Error: {error.message}
                </div>
              )}

              {response && (
                <div className="mt-4 text-sm text-green-600">
                  📥 Response: {JSON.stringify(response, null, 2)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expected vs Actual */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Expected Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <h4 className="font-semibold text-green-600">✅ Expected (Fixed):</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>No network errors (NAVIGATE method)</li>
                  <li>Uses router.push() for navigation</li>
                  <li>No API call to localhost:8000</li>
                  <li>Success response with navigation data</li>
                  <li>Automatic redirect to /dashboard/default</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600">❌ Previous (Broken):</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>NETWORK_ERROR for localhost:8000</li>
                  <li>GET /dashboard/default as API call</li>
                  <li>ApiFetchError exceptions</li>
                  <li>Execution failed</li>
                  <li>No backend server running</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Available Navigation Routes:</strong></p>
              <ul className="list-disc list-inside">
                <li>/dashboard/default (NAVIGATE method)</li>
              </ul>
              <p className="mt-2">
                <strong>Status:</strong> {loading ? 'Testing...' : 'Ready'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TestNavigationPage() {
  return (
    <DocLoggerProvider>
      <TestNavigationComponent />
    </DocLoggerProvider>
  )
}