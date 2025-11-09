'use client'

import { AIButton, LoginButton, RegisterButton, GoogleOAuthButton } from '@/components/ai/AIButton'
import { DocLoggerProvider } from '@/lib/ai/doc-logger'
// import { ExportMarkdownButton } from '@/components/ai/ExportMarkdownButton' // TODO: Create this component
import { createAction } from '@/lib/ai/actions'

// Test action specs
const testLoginAction = createAction({
  method: 'POST',
  path: '/api/auth/login',
  doc: {
    title: 'Test Login',
    description: 'Test login with mock response'
  }
})

const testSupportAction = createAction({
  method: 'POST',
  path: '/api/support/tickets',
  doc: {
    title: 'Test Support Ticket',
    description: 'Test creating a support ticket'
  }
})

const testNonExistentAction = createAction({
  method: 'GET',
  path: '/api/nonexistent',
  doc: {
    title: 'Test Non-existent Endpoint',
    description: 'This should show validation warning'
  }
})

export default function TestAIButton() {
  const handleLogin = (data: any) => {
    console.log('Login successful:', data)
    alert(`Login successful! User: ${data.data?.user?.name || 'Unknown'}`)
  }

  const handleError = (error: Error) => {
    console.error('Test error:', error)
  }

  const handleSupportTicket = (data: any) => {
    console.log('Support ticket created:', data)
    alert(`Support ticket response: ${data.message}`)
  }

  return (
    <DocLoggerProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI360 AIButton Test Suite</h1>
            <p className="text-muted-foreground">
              Testing AIButton functionality with enhanced error handling and mock responses
            </p>
            <div className="text-sm text-muted-foreground">
              Environment: {process.env.NODE_ENV} |
              Debug: {process.env.NEXT_PUBLIC_AI360_DEBUG === 'true' ? 'ON' : 'OFF'} |
              Mock API: {process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ? 'ON' : 'OFF'}
            </div>
          </div>

          {/* Test 1: Login Button with predefined action */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 1: Predefined LoginButton</h2>
            <p className="text-sm text-muted-foreground">
              Uses predefined LoginButton with mock response for /api/auth/login
            </p>
            <LoginButton
              email="test@example.com"
              password="testpassword"
              onLogin={handleLogin}
              onActionError={handleError}
              className="w-full"
            />
          </div>

          {/* Test 2: Generic AIButton with custom action */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 2: Generic AIButton (Login)</h2>
            <p className="text-sm text-muted-foreground">
              Generic AIButton with custom action spec
            </p>
            <AIButton
              spec={testLoginAction}
              data={{ email: "generic@example.com", password: "genericpass" }}
              onActionSuccess={handleLogin}
              onActionError={handleError}
              loadingText="Logging in..."
              errorText="Login failed"
              className="w-full"
            >
              Generic Login Button
            </AIButton>
          </div>

          {/* Test 3: Support Ticket Action */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 3: Support Ticket Creation</h2>
            <p className="text-sm text-muted-foreground">
              Tests /api/support/tickets endpoint with mock response
            </p>
            <AIButton
              spec={testSupportAction}
              data={{
                subject: "Test Support Ticket",
                message: "This is a test support ticket created via AIButton",
                priority: "medium"
              }}
              onActionSuccess={handleSupportTicket}
              onActionError={handleError}
              loadingText="Creating ticket..."
              errorText="Failed to create ticket"
              className="w-full"
            >
              Create Support Ticket
            </AIButton>
          </div>

          {/* Test 4: Register Button */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 4: RegisterButton</h2>
            <p className="text-sm text-muted-foreground">
              Tests user registration with mock response
            </p>
            <RegisterButton
              email="newuser@example.com"
              password="newpassword"
              name="New Test User"
              onRegister={handleLogin}
              onActionError={handleError}
              className="w-full"
            />
          </div>

          {/* Test 5: Google OAuth Button */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 5: Google OAuth Button</h2>
            <p className="text-sm text-muted-foreground">
              Tests Google OAuth flow with mock response
            </p>
            <GoogleOAuthButton
              redirectTo="/dashboard"
              onSuccess={(data) => console.log('Google OAuth:', data)}
              onActionError={handleError}
              className="w-full"
            />
          </div>

          {/* Test 6: Non-existent endpoint (should show validation warning) */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Test 6: Non-existent Endpoint</h2>
            <p className="text-sm text-muted-foreground">
              Tests validation with non-existent endpoint (should show warning in console)
            </p>
            <AIButton
              spec={testNonExistentAction}
              onActionSuccess={(data) => console.log('Non-existent success:', data)}
              onActionError={handleError}
              loadingText="Testing..."
              errorText="Expected failure"
              variant="destructive"
              className="w-full"
            >
              Test Non-existent Endpoint
            </AIButton>
          </div>

          {/* Documentation Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">AI360 Workflow Documentation</h2>
            <p className="text-sm text-muted-foreground">
              View the complete workflow log and export as documentation
            </p>
            <div className="flex gap-4">
              {/* TODO: Create ExportMarkdownButton component */}
              <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                Export Markdown Button (Component Not Yet Available)
              </div>
            </div>
          </div>

          {/* Console Instructions */}
          <div className="border rounded-lg p-6 space-y-4 bg-muted/50">
            <h2 className="text-xl font-semibold">Debug Instructions</h2>
            <div className="space-y-2 text-sm">
              <p>🔍 <strong>Open browser console</strong> to see detailed AI360 logging:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>🚀 Request execution details</li>
                <li>🌐 API request/response information</li>
                <li>✅ Success responses with mock mode indicators</li>
                <li>❌ Detailed error classification</li>
                <li>⚠️ ActionSpec validation warnings</li>
              </ul>
              <p>📝 <strong>Check network tab</strong> to see if requests use mock responses or real backend</p>
              <p>🔧 <strong>Environment variables</strong> control behavior:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>NEXT_PUBLIC_AI360_DEBUG=true - Enables detailed console logging</li>
                <li>NEXT_PUBLIC_USE_MOCK_API=true - Uses mock responses when backend unavailable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DocLoggerProvider>
  )
}