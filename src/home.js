import React from 'react'
import GetFiles from './getFiles'

function Home() {
  return (
    <div>
        <h1 className="">
          <a href="/upload">Upload</a> you Files
        </h1>


        <div className="">
          <GetFiles></GetFiles>
        </div>
    </div>
  )
}

export default Home