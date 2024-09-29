import { useEffect, useState } from 'react'
import './App.css'
import LabParser from './parse'

function App() {

  useEffect(() => {

    LabParser.parse()
  }, [])

  return (
    <>
      <div>
        <div className='wrapper'>
          <div className='box'>
            <div className='inner-box'></div>
            <div className='invisible-box'></div>
            <div className='my-box'>
              <span className='title' style={{color: 'red'}}>Second Box</span>
              <span className='title' style={{color: 'red'}}>third Box</span>
              <span className='hoge-span'>hoge Box</span>
            </div>
            <div className='my-box'>
              <span className='title' style={{color: 'red'}}>Second Box</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
