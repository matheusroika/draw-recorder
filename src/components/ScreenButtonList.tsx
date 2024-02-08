import { useApp } from '@/contexts/AppProvider'
import { DialogClose } from '@/components/shadcn/ui/dialog'
import { Source } from '@/types'

interface Props {
  screens: Source[]
}

export function ScreenButtonList({ screens }: Props) {
  const { setMediaRecorder, userSettings, setUserSettings } = useApp()

  async function selectScreen(screen: Source) {
    //eslint-disable-next-line
    const stream = await (window.navigator.mediaDevices as any).getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screen.id
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screen.id
        }
      }
    })
    
    setUserSettings({ ...userSettings, lastSelectedSourceId: screen.id })
    setMediaRecorder(new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9',
      videoBitsPerSecond: 6000000
    }))
  }

  return (
  <ul className='grid grid-cols-2 gap-4 justify-center mt-4'>
    {screens.map(screen => (
      <li key={screen.id}>
        <DialogClose asChild>
          <button className='block w-full h-full mx-auto flex flex-col group' onClick={() => selectScreen(screen)}>
            <div className='w-[150px] h-[85px] mx-auto flex items-center bg-secondary rounded ring-offset-2 ring-offset-secondary ring-primary group-hover:ring-2 overflow-hidden'>
              <img src={screen.thumbnailURL} className='max-w-[150px] max-h-[85px] mx-auto' />
            </div>
            <p className='text-center w-full text-ellipsis whitespace-nowrap overflow-hidden mt-2'>{screen.name}</p>
          </button>
        </DialogClose>
      </li>
    ))}
   </ul>
  )
}