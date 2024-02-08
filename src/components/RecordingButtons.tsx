import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { useApp } from '@/contexts/AppProvider'
import { Buffer } from 'buffer'
import fixWebmDuration from 'fix-webm-duration'
const api = window.api

export function RecordingButtons() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [pauseStartTime, setPauseStartTime] = useState(0)
  const [pauseDuration, setPauseDuration] = useState(0)
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
    <div className='flex flex-col gap-4'>
      <Button disabled={isRecording} onClick={startRecording}>Start Recording</Button>
      <Button disabled={!isRecording} onClick={stopRecording}>Stop Recording</Button>
      <button id='resumeRecording' className='' onClick={resumeRecording} disabled={!isPaused}>Resume</button>
      <button id='pauseRecording' className='' onClick={pauseRecording} disabled={isPaused}>Pause</button>
    </div>
  )
}