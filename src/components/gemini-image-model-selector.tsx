import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { useGeminiModelOptions } from '@/hooks/use-gemini-models';
import { getModelInfo, isValidModel } from '@/lib/gemini-models';
import { GeminiCoreClient } from '@/lib/gemini/client-core';
import { AlertTriangle, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GeminiImageModelSelectorProps {
  currentModel?: string;
  apiKey?: string;
  onModelChange: (
    modelId: string
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  disabled?: boolean;
}

export function GeminiImageModelSelector({
  currentModel,
  apiKey,
  onModelChange,
  loading = false,
  disabled = false,
}: Readonly<GeminiImageModelSelectorProps>) {
  const [selectedModel, setSelectedModel] = useState(currentModel || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: allModelOptions = [], isLoading: loadingModels } =
    useGeminiModelOptions(apiKey);

  // Filter models to show only those with vision/multimodal capabilities for image generation
  const imageModelOptions = allModelOptions.filter((option) => {
    const modelInfo = getModelInfo(option.value);
    return modelInfo?.capabilities.vision || modelInfo?.capabilities.multimodal;
  });

  const currentModelInfo = getModelInfo(selectedModel);
  const hasApiKey = !!apiKey;

  const testModel = async () => {
    if (!apiKey || !selectedModel) {
      toast.error('Yêu Cầu Kiểm Tra Thiếu', {
        description: 'Cần có API key và lựa chọn mô hình để kiểm tra.',
      });
      setTestResult({
        success: false,
        message: 'Cần có API key và lựa chọn mô hình để kiểm tra.',
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
        toast.success('Kiểm Tra Mô Hình Thành Công', {
          description: `${
            currentModelInfo?.name || selectedModel
          } đang hoạt động bình thường`,
        });
        setTestResult({
          success: true,
          message: `${
            currentModelInfo?.name || selectedModel
          } đang hoạt động bình thường.`,
        });
      } else {
        toast.error('Kiểm Tra Mô Hình Thất Bại', {
          description: result.error || 'Không thể kiểm tra kết nối mô hình',
        });
        setTestResult({
          success: false,
          message: result.error || 'Không thể kiểm tra kết nối mô hình.',
        });
      }
    } catch (error: unknown) {
      toast.error('Lỗi Kiểm Tra Mô Hình', {
        description:
          error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi không mong muốn trong quá trình kiểm tra',
      });
      setTestResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi không mong muốn trong quá trình kiểm tra.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    const isValid = await isValidModel(modelId, apiKey);
    if (!isValid) {
      toast.error('Mô Hình Không Hợp Lệ', {
        description:
          'Mô hình đã chọn không được hỗ trợ hoặc đã bị ngừng sử dụng.',
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
          description:
            result.error || 'Không thể lưu lựa chọn mô hình hình ảnh.',
        });
        // Revert selection on failure
        setSelectedModel(currentModel || '');
      } else {
        const modelInfo = getModelInfo(modelId);
        toast.success('Đã Cập Nhật Mô Hình Hình Ảnh', {
          description: `Đã chuyển sang ${modelInfo?.name || modelId}`,
        });
      }
    } catch (error: unknown) {
      toast.error('Lỗi', {
        description:
          error instanceof Error
            ? error.message
            : 'Không thể lưu lựa chọn mô hình hình ảnh.',
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
          <Camera className='w-5 h-5' />
          Mô Hình AI Tạo Hình Ảnh (Gemini)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* No Model Selected Warning */}
        {!selectedModel && (
          <Alert>
            <AlertTriangle className='w-4 h-4' />
            <AlertDescription>
              Chưa chọn mô hình AI hình ảnh. Vui lòng chọn mô hình để kích hoạt
              các tính năng AI tạo hình ảnh và phân tích hình ảnh thực phẩm.
            </AlertDescription>
          </Alert>
        )}

        {/* Model Selection */}
        <div className='space-y-2'>
          <Label htmlFor='gemini-image-model'>Mô Hình Hình Ảnh</Label>
          <Combobox
            value={selectedModel}
            onChange={handleModelChange}
            disabled={loading || saving || disabled || loadingModels}
            placeholder={
              loadingModels
                ? 'Đang tải mô hình...'
                : 'Chọn mô hình Gemini cho hình ảnh'
            }
            notFoundText='Không có mô hình hình ảnh nào khả dụng'
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
                : imageModelOptions.map((option) => ({
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

        {/* No Image Models Available Warning */}
        {!loadingModels && imageModelOptions.length === 0 && hasApiKey && (
          <Alert>
            <AlertTriangle className='w-4 h-4' />
            <AlertDescription>
              Không có mô hình hình ảnh nào khả dụng với API key hiện tại. Vui
              lòng kiểm tra lại cấu hình API key.
            </AlertDescription>
          </Alert>
        )}

        {/* Model Information */}
        {currentModelInfo && (
          <Alert>
            <AlertDescription>
              <div className='space-y-2'>
                <p className='font-medium'>{currentModelInfo.name}</p>
                <p className='text-sm'>{currentModelInfo.description}</p>
                <div className='flex flex-wrap gap-2 text-xs'>
                  {currentModelInfo.capabilities.text && (
                    <Badge variant='outline'>Tạo Văn Bản</Badge>
                  )}
                  {currentModelInfo.capabilities.vision && (
                    <Badge variant='outline'>Phân Tích Hình Ảnh</Badge>
                  )}
                  {currentModelInfo.capabilities.multimodal && (
                    <Badge variant='outline'>Đa Phương Thức</Badge>
                  )}
                  {currentModelInfo.isRecommended && (
                    <Badge variant='default'>Được Khuyến Nghị</Badge>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Test Connection */}
        {hasApiKey && imageModelOptions.length > 0 && (
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
                  Đang Kiểm Tra Mô Hình...
                </>
              ) : (
                <>
                  <Camera className='w-4 h-4 mr-2' />
                  Kiểm Tra Kết Nối Mô Hình
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
              Cấu hình Gemini API key ở trên để kiểm tra và sử dụng các mô hình
              AI hình ảnh.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {(loading || saving) && (
          <Alert>
            <Loader2 className='w-4 h-4 animate-spin' />
            <AlertDescription>
              {saving ? 'Đang lưu lựa chọn mô hình...' : 'Đang tải...'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
