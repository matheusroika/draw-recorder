import { createRoot } from 'react-dom/client'
import { useEffect, useRef } from 'react'
import { ScreenPickerModal } from './components/ScreenPickerModal'
import { ThemeProvider } from './contexts/ThemeProvider'
import { ModeToggle } from './components/ModeToggle'
import { RecordingButtons } from './components/RecordingButtons'
import { AppProvider, useApp } from './contexts/AppProvider'
import './styles.css'

function App() {
  const { userSettings } = useApp()
  const sourceRef = useRef<HTMLVideoElement>()
  
  async function getSourceStream() {
    const sourceId = userSettings.lastSelectedSourceId || 'screen:0:0'
    //eslint-disable-next-line
    const stream: MediaStream = await (window.navigator.mediaDevices as any).getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId
        }
      }
    })
    //stream.getVideoTracks()[0].getSettings().
    sourceRef.current.srcObject = stream
  }

  useEffect(() => {
    getSourceStream()
  }, [userSettings])

  return (
    <>
    <main className='p-10 h-screen'>
      <ModeToggle className='absolute top-4 right-4' />
      <div className='w-full h-full flex gap-10 items-center'>
        <div className='w-[60%] h-full flex items-center bg-secondary'>
          <video src="#" autoPlay ref={sourceRef} className='ring-2 ring-red-500 h-fit' />
        </div>
          
        <div className="buttons flex flex-col gap-4">
          <ScreenPickerModal />
          <RecordingButtons />
        </div>
      </div>
    </main>

    
    </>
  )
}

const root = createRoot(document.body)
root.render(
  <AppProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AppProvider>
)