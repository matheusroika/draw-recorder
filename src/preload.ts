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
	saveUserSettings: (settings: UserSettings) => ipcRenderer.invoke('saveUserSettings', settings),
	getVideoPath: () => ipcRenderer.invoke('getVideoPath'),
	saveVideo: (path: string, content: Buffer) => ipcRenderer.invoke('saveVideo', path, content),
	startIohook: () => ipcRenderer.invoke('startIohook'),
	stopIohook: () => ipcRenderer.invoke('stopIohook'),
	resumeRecording: (callback: () => void) => ipcRenderer.once('resumeRecording', callback),
	pauseRecording: (callback: () => void) => ipcRenderer.once('pauseRecording', callback),
}

contextBridge.exposeInMainWorld('api', contextBridgeApi)