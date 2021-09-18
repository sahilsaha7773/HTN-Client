import React from 'react'
import { BeatLoader } from 'react-spinners'

function Loader() {
  return (
    <div className="loader">
      <BeatLoader size={40} color="blue" />
    </div>
  )
}

export default Loader
