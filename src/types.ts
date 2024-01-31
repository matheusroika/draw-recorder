import { DesktopCapturerSource } from 'electron'

export type UserSettings = {
  lastSelectedSourceId: string
	isDarkModeOn: boolean
}

export type ContextBridgeApi = {
	isOSX: () => boolean
	isWindows: () => boolean
	isLinux: () => boolean
	openScreenSecurity: () => Promise<void>
	getScreenAccess: () => Promise<boolean>
	getScreenSources: () => Promise<DesktopCapturerSource[]>
	getUserSettings: () => Promise<UserSettings>
	saveUserSettings: (userSettings: UserSettings) => Promise<void>
}

export interface Source extends DesktopCapturerSource {
  thumbnailURL: string
}