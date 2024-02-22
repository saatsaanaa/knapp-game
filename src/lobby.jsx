import './lobby.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import store from './store/index'

import Lobby from './javascript/Lobby.jsx'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reactComponentRoot')
  const root = createRoot(container)
  root.render(
    <Provider store={store}>
      <Lobby />
    </Provider>
  )
})
