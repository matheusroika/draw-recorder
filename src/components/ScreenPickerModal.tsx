import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"
import { Source } from '@/types'
import { ScreenButtonList } from './ScreenButtonList'

const api = window.api

interface Props {
  className?: string
}

export function ScreenPickerModal({ className }: Props) {
  const [apps, setApps] = useState([] as Source[])
  const [screens, setScreens] = useState([] as Source[])

  async function getSources() {
    const sources = await api.getScreenSources()
    setApps(sources.filter(source => source.id.includes('window')))
    setScreens(sources.filter(source => source.id.includes('screen')))
  }

  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button variant='outline' onClick={getSources}>Select screen</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select source to record</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="screens">
          <div className='px-6'>
            <TabsList className='w-full'>
              <TabsTrigger value="screens" className='w-full'>Screens</TabsTrigger>
              <TabsTrigger value="apps" className='w-full'>Apps</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="screens">
            <ScreenButtonList screens={screens} />
          </TabsContent>
          <TabsContent value="apps">
            <ScreenButtonList screens={apps} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}