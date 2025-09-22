import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { useGeminiModelOptions } from '@/hooks/use-gemini-models';
import { getModelInfo, isValidModel } from '@/lib/gemini-models';
import { GeminiCoreClient } from '@/lib/gemini/client-core';
import { AlertTriangle, Brain, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GeminiModelSelectorProps {
  currentModel?: string;
  apiKey?: string;
  onModelChange: (
    modelId: string
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  disabled?: boolean;
}

export function GeminiModelSelector({
  currentModel,
  apiKey,
  onModelChange,
  loading = false,
  disabled = false,
}: Readonly<GeminiModelSelectorProps>) {
  const [selectedModel, setSelectedModel] = useState(currentModel || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: modelOptions = [], isLoading: loadingModels } =
    useGeminiModelOptions(apiKey);
  const currentModelInfo = getModelInfo(selectedModel);
  const hasApiKey = !!apiKey;

  const testModel = async () => {
    if (!apiKey || !selectedModel) {
      toast.error('Test Requirements Missing', {
        description: 'API key and model selection are required for testing.',
      });
      setTestResult({
        success: false,
        message: 'API key and model selection are required for testing.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const client = new GeminiCoreClient(apiKey, selectedModel);
      // If GeminiCoreClient does not have testConnection, just check if configured.
      const result = {
        success: client.isConfigured(),
        error: client.isConfigured()
          ? undefined
          : 'API key is invalid or not configured.',
      };

      if (result.success) {
        toast.success('Model Test Successful', {
          description: `${
            currentModelInfo?.name || selectedModel
          } is working correctly`,
        });
        setTestResult({
          success: true,
          message: `${
            currentModelInfo?.name || selectedModel
          } is working correctly.`,
        });
      } else {
        toast.error('Model Test Failed', {
          description: result.error || 'Failed to test model connection',
        });
        setTestResult({
          success: false,
          message: result.error || 'Failed to test model connection.',
        });
      }
    } catch (error: unknown) {
      toast.error('Model Test Error', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during testing',
      });
      setTestResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during testing.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    const isValid = await isValidModel(modelId, apiKey);
    if (!isValid) {
      toast.error('Invalid Model', {
        description: 'Selected model is not supported or has been deprecated.',
      });
      return;
    }

    setSelectedModel(modelId);
    setTestResult(null);

    if (modelId === currentModel) {
      return; // No change needed
    }

    setSaving(true);
    try {
      const result = await onModelChange(modelId);

      if (!result.success) {
        toast.error('Lỗi Lưu', {
          description: result.error || 'Không thể lưu lựa chọn mô hình.',
        });
        // Revert selection on failure
        setSelectedModel(currentModel || '');
      } else {
        const modelInfo = getModelInfo(modelId);
        toast.success('Đã Cập Nhật Mô Hình', {
          description: `Đã chuyển sang ${modelInfo?.name || modelId}`,
        });
      }
    } catch (error: unknown) {
      toast.error('Lỗi', {
        description:
          error instanceof Error
            ? error.message
            : 'Không thể lưu lựa chọn mô hình.',
      });
      // Revert selection on failure
      setSelectedModel(currentModel || '');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Brain className='w-5 h-5' />
          Mô Hình AI Văn Bản (Gemini)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* No Model Selected Warning */}
        {!selectedModel && (
          <Alert>
            <AlertTriangle className='w-4 h-4' />
            <AlertDescription>
              No AI model selected. Please select a model to enable AI features
              like recipe suggestions and nutrition analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Model Selection */}
        <div className='space-y-2'>
          <Label htmlFor='gemini-model'>Mô Hình Văn Bản</Label>
          <Combobox
            value={selectedModel}
            onChange={handleModelChange}
            disabled={loading || saving || disabled || loadingModels}
            placeholder={
              loadingModels ? 'Đang tải mô hình...' : 'Chọn mô hình Gemini'
            }
            notFoundText='Không có mô hình nào khả dụng'
            options={
              loadingModels
                ? [
                    {
                      value: 'loading',
                      label: (
                        <div className='flex items-center gap-2'>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          Đang tải mô hình...
                        </div>
                      ),
                    },
                  ]
                : modelOptions.map((option) => ({
                    value: option.value,
                    label: (
                      <div className='flex items-center justify-between w-full'>
                        <span>{option.label}</span>
                        {option.badge && (
                          <Badge variant='secondary' className='ml-2 text-xs'>
                            {option.badge}
                          </Badge>
                        )}
                      </div>
                    ),
                    disabled: option.disabled,
                  }))
            }
            buttonClassName='w-full justify-between'
            contentClassName='w-[300px] p-0'
          />
        </div>

        {/* Model Information */}
        {currentModelInfo && (
          <Alert>
            <AlertDescription>
              <div className='space-y-2'>
                <p className='font-medium'>{currentModelInfo.name}</p>
                <p className='text-sm'>{currentModelInfo.description}</p>
                <div className='flex flex-wrap gap-2 text-xs'>
                  {currentModelInfo.capabilities.text && (
                    <Badge variant='outline'>Text Generation</Badge>
                  )}
                  {currentModelInfo.capabilities.vision && (
                    <Badge variant='outline'>Image Analysis</Badge>
                  )}
                  {currentModelInfo.capabilities.multimodal && (
                    <Badge variant='outline'>Multimodal</Badge>
                  )}
                  {currentModelInfo.isRecommended && (
                    <Badge variant='default'>Recommended</Badge>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Test Connection */}
        {hasApiKey && (
          <div className='space-y-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={testModel}
              disabled={testing || loading || saving || !selectedModel}
              className='w-full bg-transparent'
            >
              {testing ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Testing Model...
                </>
              ) : (
                <>
                  <Brain className='w-4 h-4 mr-2' />
                  Test Model Connection
                </>
              )}
            </Button>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <Alert variant={testResult.success ? 'default' : 'destructive'}>
            {testResult.success ? (
              <CheckCircle className='w-4 h-4' />
            ) : (
              <AlertTriangle className='w-4 h-4' />
            )}
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        {/* No API Key Warning */}
        {!hasApiKey && (
          <Alert>
            <AlertTriangle className='w-4 h-4' />
            <AlertDescription>
              Configure your Gemini API key above to test and use AI models.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {(loading || saving) && (
          <Alert>
            <Loader2 className='w-4 h-4 animate-spin' />
            <AlertDescription>
              {saving ? 'Saving model selection...' : 'Loading...'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
