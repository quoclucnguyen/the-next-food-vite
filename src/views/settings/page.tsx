'use client';

import { CategoriesUnitsManager } from '@/components/categories-units-manager';
import { GeminiApiKeySetup } from '@/components/gemini-api-key-setup';
import { GeminiImageModelSelector } from '@/components/gemini-image-model-selector';
import { GeminiModelSelector } from '@/components/gemini-model-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';
import {
  ArrowLeft,
  Bell,
  Loader2,
  Palette,
  Settings,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router';

export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isError,
    error,
    updateGeminiApiKey,
    removeGeminiApiKey,
    updatePreferences,
    hasGeminiApiKey,
    hasApiKeyInDb,
    getSelectedGeminiModel,
    getSelectedImageModel,
  } = useSettings();

  const handlePreferenceChange = async (
    key: string,
    value: string | boolean | number
  ) => {
    await updatePreferences({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Alert variant='destructive'>
          <AlertDescription>
            Lỗi tải cài đặt: {error?.message || 'Đã xảy ra lỗi không xác định.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center gap-3'>
            <Link to='/'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
            </Link>
            <h1 className='text-xl font-bold text-gray-900'>Cài đặt</h1>
          </div>
        </div>
      </div>

      <div className='p-4 space-y-6'>
        {/* Gemini API Configuration */}
        <GeminiApiKeySetup
          currentApiKey={settings.geminiApiKey}
          onSave={updateGeminiApiKey}
          onRemove={removeGeminiApiKey}
          loading={isLoading}
          hasApiKeyInDb={hasApiKeyInDb}
        />

        {/* Gemini Model Selection for Text */}
        <GeminiModelSelector
          currentModel={getSelectedGeminiModel() ?? undefined}
          apiKey={settings.geminiApiKey}
          onModelChange={async (modelId: string) => {
            try {
              await updatePreferences({ selectedGeminiModel: modelId });
              return { success: true };
            } catch (error: unknown) {
              return {
                success: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Lỗi khi lưu lựa chọn mô hình văn bản',
              };
            }
          }}
          loading={isLoading}
          disabled={!hasGeminiApiKey}
        />

        {/* Gemini Model Selection for Image Generation */}
        <GeminiImageModelSelector
          currentModel={getSelectedImageModel() ?? undefined}
          apiKey={settings.geminiApiKey}
          onModelChange={async (modelId: string) => {
            try {
              await updatePreferences({ selectedImageModel: modelId });
              return { success: true };
            } catch (error: unknown) {
              return {
                success: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Lỗi khi lưu lựa chọn mô hình hình ảnh',
              };
            }
          }}
          loading={isLoading}
          disabled={!hasGeminiApiKey}
        />

        {/* Categories & Units Management */}
        <CategoriesUnitsManager />

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='w-5 h-5' />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='expiration-alerts'>Nhắc nhở hết hạn</Label>
                <p className='text-sm text-gray-600'>
                  Nhận thông báo khi thực phẩm sắp hết hạn
                </p>
              </div>
              <Switch
                id='expiration-alerts'
                checked={settings.preferences.expirationAlerts !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('expirationAlerts', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='recipe-suggestions'>Gợi ý công thức</Label>
                <p className='text-sm text-gray-600'>
                  Nhận gợi ý công thức từ AI dựa trên kho của bạn
                </p>
              </div>
              <Switch
                id='recipe-suggestions'
                checked={settings.preferences.recipeSuggestions !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('recipeSuggestions', checked)
                }
                disabled={!hasGeminiApiKey}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='shopping-reminders'>Nhắc nhở mua sắm</Label>
                <p className='text-sm text-gray-600'>
                  Nhận nhắc nhở đi mua sắm khi kho sắp hết
                </p>
              </div>
              <Switch
                id='shopping-reminders'
                checked={settings.preferences.shoppingReminders !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('shoppingReminders', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='w-5 h-5' />
              Quyền riêng tư & Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='data-sync'>Đồng bộ dữ liệu</Label>
                <p className='text-sm text-gray-600'>
                  Đồng bộ dữ liệu của bạn trên các thiết bị
                </p>
              </div>
              <Switch
                id='data-sync'
                checked={settings.preferences.dataSync !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('dataSync', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='offline-mode'>Chế độ ngoại tuyến</Label>
                <p className='text-sm text-gray-600'>
                  Cho phép ứng dụng hoạt động ngoại tuyến với dữ liệu đã lưu
                </p>
              </div>
              <Switch
                id='offline-mode'
                checked={settings.preferences.offlineMode !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('offlineMode', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Palette className='w-5 h-5' />
              Giao diện
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='compact-view'>Chế độ xem gọn</Label>
                <p className='text-sm text-gray-600'>
                  Hiển thị nhiều mục hơn trong danh sách với thẻ nhỏ hơn
                </p>
              </div>
              <Switch
                id='compact-view'
                checked={settings.preferences.compactView === true}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('compactView', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='show-images'>Hiển thị hình ảnh</Label>
                <p className='text-sm text-gray-600'>
                  Hiển thị hình ảnh thực phẩm và công thức
                </p>
              </div>
              <Switch
                id='show-images'
                checked={settings.preferences.showImages !== false}
                onCheckedChange={(checked: boolean) =>
                  handlePreferenceChange('showImages', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='w-5 h-5' />
              Thông tin ứng dụng
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Phiên bản</span>
              <span>1.0.0</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Cập nhật lần cuối</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Trạng thái Gemini API</span>
              <span
                className={hasGeminiApiKey ? 'text-green-600' : 'text-gray-500'}
              >
                {hasGeminiApiKey ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
