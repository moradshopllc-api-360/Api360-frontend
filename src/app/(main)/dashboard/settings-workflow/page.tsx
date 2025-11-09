'use client'

import { ArrowLeft, Database, TestTube, FileText, Activity } from "lucide-react";

import { AIWorkflowStatus } from "@/components/ai/AIWorkflowStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIButton } from "@/components/ai/AIButton";
import { useDocLogger } from "@/lib/ai/doc-logger";
import Link from "next/link";

export default function WorkflowSettingsPage() {
  const { logs, clearLogs, downloadMarkdown } = useDocLogger();

  const handleExport = () => {
    downloadMarkdown('ai360-workflow-logs');
  };

  return (
    <div className="container mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflow Settings</h1>
            <p className="text-muted-foreground">
              Manage AI360 workflow configuration, API testing, and documentation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* AI360 Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>AI360 Integration</CardTitle>
            </div>
            <CardDescription>
              Configure and monitor AI360 workflow system components and API connections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Export Workflow Logs</p>
                    <p className="text-xs text-muted-foreground">
                      Download all workflow activity as markdown
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={logs.length === 0}
                >
                  Export ({logs.length})
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Clear Logs</p>
                    <p className="text-xs text-muted-foreground">
                      Remove all logged workflow entries
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                >
                  Clear ({logs.length})
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TestTube className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">API Connection Test</p>
                    <p className="text-xs text-muted-foreground">
                      Test API connectivity and logging
                    </p>
                  </div>
                </div>
                <AIButton
                  spec={{
                    method: 'GET',
                    path: '/api/health',
                    doc: {
                      title: 'Health Check',
                      description: 'Test API connectivity'
                    }
                  }}
                  size="sm"
                  loadingText="Testing..."
                  errorText="Failed"
                >
                  Test
                </AIButton>
              </div>
            </div>

            {/* Additional API Testing Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">API Testing Tools</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AIButton
                  spec={{
                    method: 'GET',
                    path: '/api/test/users',
                    doc: {
                      title: 'Users API Test',
                      description: 'Test users endpoint functionality'
                    }
                  }}
                  className="w-full"
                  loadingText="Testing users API..."
                  errorText="Users API failed"
                >
                  Test Users API
                </AIButton>

                <AIButton
                  spec={{
                    method: 'GET',
                    path: '/api/test/auth',
                    doc: {
                      title: 'Auth API Test',
                      description: 'Test authentication endpoints'
                    }
                  }}
                  className="w-full"
                  loadingText="Testing auth API..."
                  errorText="Auth API failed"
                >
                  Test Auth API
                </AIButton>

                <AIButton
                  spec={{
                    method: 'GET',
                    path: '/api/test/workflow',
                    doc: {
                      title: 'Workflow API Test',
                      description: 'Test workflow integration'
                    }
                  }}
                  className="w-full"
                  loadingText="Testing workflow API..."
                  errorText="Workflow API failed"
                >
                  Test Workflow API
                </AIButton>
              </div>
            </div>

            {/* AI Workflow Status */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Workflow Activity</h3>
              <AIWorkflowStatus maxEntries={15} showActions={true} />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Documentation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Workflow Documentation</CardTitle>
            </div>
            <CardDescription>
              Access workflow documentation and configuration guides.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">API Documentation</p>
                  <p className="text-xs text-muted-foreground">
                    Complete API reference and endpoint documentation
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/docs/api">View Docs</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Workflow Guide</p>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step workflow configuration guide
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/docs/workflow">View Guide</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Integration Examples</p>
                  <p className="text-xs text-muted-foreground">
                    Sample code and integration examples
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/docs/examples">Examples</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Debug Tools</p>
                  <p className="text-xs text-muted-foreground">
                    Advanced debugging and troubleshooting tools
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/debug">Debug Tools</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}