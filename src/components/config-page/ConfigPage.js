import React from 'react'

import ConfigContainer from './ConfigContainer/ConfigContainer'
import './Config.css'

const ConfigPage = () => {
  return (
    <div className="Config">
      <div className="Config-dark">
        <ConfigContainer />
      </div>
    </div>
  )
}

export default ConfigPage
