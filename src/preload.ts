import { contextBridge, ipcRenderer } from 'electron'
import { ContextBridgeApi, UserSettings } from './types'

const contextBridgeApi: ContextBridgeApi = {
	isOSX: () => process.platform === 'darwin',
	isWindows: () => process.platform === 'win32',
	isLinux: () => /linux/.test(process.platform),
	openScreenSecurity: () => ipcRenderer.invoke('openScreenSecurity'),
	getScreenAccess: () => ipcRenderer.invoke('getScreenAccess'),
	getScreenSources: () => ipcRenderer.invoke('getScreenSources'),
	getUserSettings: () => ipcRenderer.invoke('getUserSettings'),
	saveUserSettings: (settings: UserSettings) => ipcRenderer.invoke('saveUserSettings', settings)
}

contextBridge.exposeInMainWorld('api', contextBridgeApi)