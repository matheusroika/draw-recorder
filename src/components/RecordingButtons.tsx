import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"
import { useApp } from '@/contexts/AppProvider'
import { Buffer } from 'buffer'
import fixWebmDuration from 'fix-webm-duration'
import { AlertCircle } from 'lucide-react'
const api = window.api

export function RecordingButtons() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [pauseStartTime, setPauseStartTime] = useState(0)
  const [pauseDuration, setPauseDuration] = useState(0)
  const [alert, setAlert] = useState({ title: '', description: '' })
  const [showAlert, setShowAlert] = useState(false)
  const { mediaRecorder } = useApp()
  let recordedChunks = [] as Blob[]

  function handleDataAvailable(e: BlobEvent) {
    if (e.data.size === 0) return
    recordedChunks.push(e.data)
  }

  async function handleStop() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    recordedChunks = []
    const videoDuration = (Date.now() - startTime) - pauseDuration
    setStartTime(0)
    setPauseStartTime(0)
    setPauseDuration(0)
    if (blob.size === 0) {
      setAlert({ title: 'Video not saved', description: 'No data received - Try clicking and holding to record' })
      setTimeout(() => {
        setShowAlert(true)
      }, 100)
      setTimeout(() => {
        setShowAlert(false)
        setTimeout(() => {
          setAlert({ title: '', description: '' })
        }, 150)
      }, 3000)
      return
    }
    const fixedBlob = await fixWebmDuration(blob, videoDuration)
    const arrayBuffer = await fixedBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = await api.getVideoPath()
    await api.saveVideo(filePath, buffer)
  }

  function startRecording() {
    setIsRecording(true)
    mediaRecorder.start()
    setStartTime(Date.now())
    pauseRecording()
    api.startIohook()
  }

  async function stopRecording() {
    await api.stopIohook()
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.onstop = handleStop
    setIsRecording(false)
    setIsPaused(false)
    mediaRecorder.stop()
  }

  function resumeRecording() {
    if (!isPaused) return
    setIsPaused(false)
    mediaRecorder.resume()
    const pauseDifference = pauseStartTime > 0 ? Date.now() - pauseStartTime : 0
    setPauseDuration(pauseDuration + pauseDifference)
  }

  function pauseRecording() {
    if (isPaused) return
    setIsPaused(true)
    mediaRecorder.pause()
    setPauseStartTime(Date.now())
  }

  api.resumeRecording(() => {
    if (!isPaused) return
    document.getElementById('resumeRecording').click()
  })

  api.pauseRecording(() => {
    if (isPaused) return
    document.getElementById('pauseRecording').click()
  })

  return (
    <>
    <div className='flex flex-col gap-4'>
      <Button disabled={isRecording} onClick={startRecording}>Start Recording</Button>
      <Button disabled={!isRecording} onClick={stopRecording}>Stop Recording</Button>
      <button id='resumeRecording' className='hidden' onClick={resumeRecording} disabled={!isPaused}>Resume</button>
      <button id='pauseRecording' className='hidden' onClick={pauseRecording} disabled={isPaused}>Pause</button>
    </div>

    <Alert className='fixed top-6 left-6 w-fit transition' style={{ opacity: showAlert ? '1' : '0', display: alert.title ? 'block' : 'none' }}>
      <div className='flex justify-center items-center gap-4'>
        <AlertCircle className='h-4 w-4' />
        <div>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </div>
      </div>
    </Alert>
    </>
  )
}