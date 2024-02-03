import { DesktopCapturerSource } from 'electron'

export type Theme = "dark" | "light" | "system"

export type UserSettings = {
  lastSelectedSourceId: string
	theme: Theme
}

export type ContextBridgeApi = {
	isOSX: () => boolean
	isWindows: () => boolean
	isLinux: () => boolean
	openScreenSecurity: () => Promise<void>
	getScreenAccess: () => Promise<boolean>
	getScreenSources: () => Promise<Source[]>
	getUserSettings: () => Promise<UserSettings>
	saveUserSettings: (userSettings: UserSettings) => Promise<void>
}

export interface Source extends DesktopCapturerSource {
  thumbnailURL: string
}