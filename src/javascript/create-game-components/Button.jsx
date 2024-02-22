import React, { useState } from 'react'
import '../../stylesheets/modal.scss'
import Cookies from 'js-cookie'

import { db } from '../firebaseConfig'
import { ref, get, child, push, update } from 'firebase/database'

const Button = () => {
  const [lobbies, setLobbies] = useState()
  return (
    <>
      <button
        className="A_Button"
        onClick={() => {
          /*Проверяем наличие айди юзера*/
          Cookies.get('id') !== undefined
            ? console.log(Cookies.get('id'))
            : console.log(Cookies.set('id', Date.now()))
          /* Находим кол-во комнат */
          get(child(ref(db), `lobbies/`)).then((snapshot) => {
            snapshot.exists()
              ? console.log(setLobbies(snapshot.val().length))
              : console.log('No data available')
          })
          /* Создаем новую */
        }}
      >
        Начать игру
      </button>
    </>
  )
}

export default Button

/*update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
            currentPlayerId: pickCurrPlayer,
            status: 'pick'
          }) */

/*document.location.href = './pages/lobby.html?id=-NqrEbfpVvhuVDob6PB8' */

/** const newPostKey = push(child(ref(db), 'posts')).key
          update(ref(db, `lobbies/${newPostKey}`), {
            : pickCurrPlayer,
            status: 'pick'
          }) */

/**const newLobbyKey = push(child(ref(db), 'lobbies')).key
          console.log(newLobbyKey)
          update(ref(db, `lobbies/${newLobbyKey}`), {
            id: lobbies,
            hostId: Cookies.get('id'),
            stage: 'wait',
            players: [
              {
                name: 'Nastya',
                hostId: Cookies.get('id'),
                role: 'host'
              }
            ]
          })
          document.location.href = `./pages/lobby.html?id=${newLobbyKey}` */
