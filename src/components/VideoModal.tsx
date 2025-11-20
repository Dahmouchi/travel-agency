/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'



const VideoModal = () => {

  const [isOpen, setOpen] = useState(false)

  return (
    <React.Fragment>


      <button className="video-btn" onClick={() => setOpen(true)}><i className="flaticon-play"></i></button>
     

    </React.Fragment>
  )
}

export default VideoModal;