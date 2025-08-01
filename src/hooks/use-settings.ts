import { useMemo, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

/* ------------------------------ types --------------------------------- */
interface UserPreferences {
  selectedGeminiModel?: string
  selectedImageModel?: string
  [key: string]: unknown // Allow for additional properties
}

interface UserSettingsRow {
  id?: string
  user_id?: string
  gemini_api_key?: string | null
  preferences: UserPreferences
  created_at?: string
  updated_at?: string
}

interface Settings {
  geminiApiKey?: string
  preferences: UserPreferences
}

/* ---------------------------- main hook ------------------------------- */
const SETTINGS_QUERY_KEY = ["user_settings"]

export function useSettings() {
  const queryClient = useQueryClient()

  /* ---------- fetch the row once (stays fresh in cache) --------------- */
  const {
    data: fetchedSettings,
    isLoading,
    isError,
    error,
  } = useQuery<UserSettingsRow, Error>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

      // PGRST116 = "no rows", perfectly OK for a brand-new user
      if (error && error.code !== "PGRST116") throw error

      const result = data || { preferences: {} }
      return result
    },
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Create settings object directly from fetched data (memoized to prevent unnecessary re-renders)
  const settings: Settings = useMemo(() => ({
    geminiApiKey: fetchedSettings?.gemini_api_key || undefined,
    preferences: {
      // No default model - user must explicitly select one
      ...fetchedSettings?.preferences,
    },
  }), [fetchedSettings?.gemini_api_key, fetchedSettings?.preferences])



  /* ------------------------ mutations ---------------------------------- */
  const saveGeminiKey = useMutation<{ success: boolean; error?: string }, Error, string>({
    mutationFn: async (apiKey) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          gemini_api_key: apiKey,
          preferences: fetchedSettings?.preferences || {},
        },
        {
          onConflict: "user_id",
        }
      )
      if (error) throw error

      return { success: true }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  })

  const removeGeminiKey = useMutation<{ success: boolean; error?: string }, Error, void>({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          gemini_api_key: null,
          preferences: fetchedSettings?.preferences || {},
        },
        {
          onConflict: "user_id",
        }
      )

      if (error) throw error
      return { success: true }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  })

  const updatePreferences = useMutation<{ success: boolean; error?: string }, Error, Partial<UserPreferences>>({
    mutationFn: async (prefs) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const merged = { ...(fetchedSettings?.preferences || {}), ...prefs }

      // Include the existing gemini_api_key to prevent it from being overwritten
      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          gemini_api_key: fetchedSettings?.gemini_api_key || null,
          preferences: merged,
        },
        {
          onConflict: "user_id",
        }
      )

      if (error) {
        console.error("Error updating preferences:", error)
        throw error
      }

      return { success: true }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  })

  /* ----------------------------- API ---------------------------------- */
  const hasGeminiApiKey = !!settings.geminiApiKey
  const hasApiKeyInDb = !!fetchedSettings?.gemini_api_key

  // Get selected Gemini model with validation (memoized to prevent unnecessary re-renders)
  const getSelectedGeminiModel = useCallback((): string | null => {
    const selectedModel = settings.preferences.selectedGeminiModel

    // Return the selected model if it exists and is valid
    if (selectedModel && selectedModel.trim() !== '') {
      return selectedModel
    }

    // No model selected - return null to force explicit selection
    return null
  }, [settings.preferences.selectedGeminiModel])

  // Get selected Image model with validation (memoized to prevent unnecessary re-renders)
  const getSelectedImageModel = useCallback((): string | null => {
    const selectedModel = settings.preferences.selectedImageModel

    // Return the selected model if it exists and is valid
    if (selectedModel && selectedModel.trim() !== '') {
      return selectedModel
    }

    // No model selected - return null to force explicit selection
    return null
  }, [settings.preferences.selectedImageModel])

  return {
    settings,
    isLoading,
    isError,
    error,
    hasGeminiApiKey,
    hasApiKeyInDb,
    getSelectedGeminiModel,
    getSelectedImageModel,
    updateGeminiApiKey: saveGeminiKey.mutateAsync,
    removeGeminiApiKey: removeGeminiKey.mutateAsync,
    updatePreferences: updatePreferences.mutateAsync,
  }
}
