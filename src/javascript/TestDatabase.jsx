import { initializeApp } from 'firebase/app'
import {
  getDatabase,
  ref,
  onValue,
  child,
  get,
  set,
  push,
  update
} from 'firebase/database'

import { useState } from 'react'

import { firebaseConfig } from './firebaseConfig.js'

import React from 'react'

const TestDatabase = () => {
  const createLobby = () => {
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)

    const names = [
      'Nastya',
      'Vika',
      'Tolya',
      'Stas',
      'Seva',
      'Alina',
      'Andrei',
      'Dasha'
    ]

    const lobbyData = {
      stage: 'wait',
      hostName: names[Math.floor(Math.random() * names.length)]
    }

    const newLobbyKey = push(child(ref(db), 'lobbies')).key
    const updates = {}
    updates['/lobbies/' + newLobbyKey] = lobbyData

    return update(ref(db), updates)
  }

  const getLobbies = () => {
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)

    const starCountRef = ref(db, 'lobbies')
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val()
      console.log(Object.entries(data))
    })
  }

  return (
    <>
      <div>Пиривет, сейчас будем показывать данные:</div>
      <button onClick={() => createLobby()}>Создать комнату</button>
      {getLobbies()}
      <div></div>
    </>
  )
}

export default TestDatabase
