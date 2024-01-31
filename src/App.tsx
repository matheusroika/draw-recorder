import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  return (
    <>
    <main>
      <div>
        <button id="darkModeButton" aria-hidden="true">
          <div id="lightModeIcon">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M7 4a7 7 0 0 1 12 5c0 2.4-1.2 3.9-2.2 5v.1c-1 1.3-1.8 2.2-1.8 3.9 0 .6-.4 1-1 1h-4a1 1 0 0 1-1-1c0-1.6-.8-2.6-1.8-3.9C6.2 12.8 5 11.4 5 9a7 7 0 0 1 2-5Zm2 17c0-.6.4-1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1.6-13.4A2 2 0 0 1 12 7a1 1 0 1 0 0-2 4 4 0 0 0-4 4 1 1 0 0 0 2 0c0-.5.2-1 .6-1.4Z" clip-rule="evenodd"/>
            </svg>
          </div>
          
          <div id="darkModeIcon">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"/>
            </svg>
          </div>
        </button>
        <video id="preview" src="#" autoPlay></video>
          
        <div className="buttons">
          <button id="startButton">Start</button>
          <button id="stopButton" className="hidden">Stop</button>
        </div>
      </div>
    </main>
    </>
  )
}

const root = createRoot(document.body)
root.render(<App />)