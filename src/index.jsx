import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Button from './javascript/create-game-components/Button.jsx'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reactCreateButtonRoot')
  const root = createRoot(container)
  root.render(<Button />)
})
