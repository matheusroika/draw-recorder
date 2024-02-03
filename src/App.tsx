import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { ScreenPickerModal } from './components/ScreenPickerModal'
import { UserSettings } from './types'
import { ThemeProvider } from './contexts/themeProvider'
import { ModeToggle } from './components/ModeToggle'

const api = window.api

function App() {
  const [userSettings, setUserSettings] = useState({} as UserSettings)
  const sourceRef = useRef<HTMLVideoElement>()

  async function getUserSettings() {
    const userSettings = await api.getUserSettings()
    setUserSettings(userSettings)
  }

  useEffect(() => {
    getUserSettings()
  }, [])

  async function getSourceStream() {
    const sourceId = userSettings.lastSelectedSourceId || 'screen:0:0'
    //eslint-disable-next-line
    const stream = await (window.navigator.mediaDevices as any).getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId
        }
      }
    })
    sourceRef.current.srcObject = stream
  }

  useEffect(() => {
    getSourceStream()
  }, [userSettings])

  return (
    <>
    <main>
      <div>
        <ModeToggle />
        <div className='w-[60%] h-[300px] flex items-center bg-secondary ml-8'>
          <video src="#" autoPlay ref={sourceRef} className='ring-2 ring-red-500 h-fit' />
        </div>
          
        <div className="buttons">
          <button id="startButton">Start</button>
          <button id="stopButton" className="hidden">Stop</button>
        </div>
      </div>
    </main>

    <ScreenPickerModal className='baba' />
    </>
  )
}

const root = createRoot(document.body)
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)