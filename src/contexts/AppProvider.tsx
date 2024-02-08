import { UserSettings } from '@/types'
import { createContext, useContext, useEffect, useState } from "react"
const api = window.api

type AppProviderProps = {
  children: React.ReactNode
}

type AppProviderState = {
  mediaRecorder: MediaRecorder
  setMediaRecorder: (mediaRecorder: MediaRecorder) => void
  userSettings: UserSettings
  setUserSettings: (userSettings: UserSettings) => void
}

const initialState: AppProviderState = {
  mediaRecorder: null,
  setMediaRecorder: () => null,
  userSettings: { lastSelectedSourceId: 'screen:0:0', theme: 'system' },
  setUserSettings: () => null
}

const AppProviderContext = createContext<AppProviderState>(initialState)

export function AppProvider({ children, ...props }: AppProviderProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null)
  const [userSettings, setUserSettings] = useState({} as UserSettings)

  async function getUserSettings() {
    const userSettings = await api.getUserSettings()
    setUserSettings(userSettings)
  }

  useEffect(() => {
    getUserSettings()
  }, [])

  const value = {
    mediaRecorder,
    setMediaRecorder: async (mediaRecorder: MediaRecorder) => {
      setMediaRecorder(mediaRecorder)
    },
    userSettings,
    setUserSettings: async (userSettings: UserSettings) => {
      setUserSettings(userSettings)
      await api.saveUserSettings(userSettings)
    }
  }

  return (
    <AppProviderContext.Provider {...props} value={value}>
      {children}
    </AppProviderContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppProviderContext)

  if (context === undefined)
    throw new Error("useApp must be used within a AppProvider")

  return context
}
