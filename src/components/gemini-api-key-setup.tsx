

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Key, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { GeminiClient } from "@/lib/gemini-client"

interface GeminiApiKeySetupProps {
  currentApiKey?: string
  onSave: (apiKey: string) => Promise<{ success: boolean; error?: string }>
  onRemove: () => Promise<{ success: boolean; error?: string }>
  loading?: boolean
  hasApiKeyInDb: boolean
}

export function GeminiApiKeySetup({
  currentApiKey,
  onSave,
  onRemove,
  loading = false,
  hasApiKeyInDb,
}: GeminiApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const hasApiKey = !!currentApiKey

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "Please enter an API key to test." })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const client = new GeminiClient(apiKey.trim())
      const result = await client.testConnection()

      if (result.success) {
        setTestResult({ success: true, message: "API key is valid and working!" })
      } else {
        setTestResult({ success: false, message: result.error || "Failed to validate API key." })
      }
    } catch (error: unknown) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : "Failed to test API key." })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "Please enter an API key to save." })
      return
    }

    setSaving(true)
    try {
      const result = await onSave(apiKey.trim())
      if (result.success) {
        setApiKey("") // Clear input on successful save
        setTestResult({ success: true, message: "API key saved successfully!" })
      } else {
        setTestResult({ success: false, message: result.error || "Failed to save API key." })
      }
    } catch (error: unknown) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : "Failed to save API key." })
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setSaving(true)
    try {
      const result = await onRemove()
      if (result.success) {
        setApiKey("") // Clear input on successful removal
        setTestResult({ success: true, message: "API key removed successfully!" })
      } else {
        setTestResult({ success: false, message: result.error || "Failed to remove API key." })
      }
    } catch (error: unknown) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : "Failed to remove API key." })
    } finally {
      setSaving(false)
    }
  }

  // Determine the placeholder text for the input field
  const inputPlaceholder = hasApiKey ? "API key is configured" : "Enter your Gemini API key"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Gemini API Configuration
          {hasApiKey && (
            <Badge variant="secondary" className="ml-auto">
              Configured
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">To get your Gemini API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Visit Google AI Studio</li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy the key and paste it below</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => window.open("https://makersuite.google.com/app/apikey", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        {hasApiKey && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Gemini API is configured and ready to use for recipe suggestions and nutrition analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">Gemini API Key</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder={inputPlaceholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={testApiKey}
            disabled={!apiKey.trim() || testing || loading}
            className="bg-transparent"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test API Key"
            )}
          </Button>

          <Button onClick={handleSave} disabled={!apiKey.trim() || saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save API Key"
            )}
          </Button>

          {hasApiKeyInDb && ( // Only show remove if a key is actually in the DB
            <Button variant="destructive" onClick={handleRemove} disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Security:</strong> Your API key is stored securely in the database and is only used for API calls.
            It is never shared with third parties and persists across browser sessions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
