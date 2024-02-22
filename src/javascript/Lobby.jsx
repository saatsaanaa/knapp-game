import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import queryString from 'query-string'
import { ref, onValue, set, update } from 'firebase/database'
import { db } from './firebaseConfig.js'

/*Компоненты*/
import PlayersList from './lobby-components/PlayersList.jsx'
import GameStatusBar from './lobby-components/GameStatusBar.jsx'
/**/

import { initLobby } from '../store/lobbySlice.js'
import { initUser } from '../store/userSlice.js'
import GameProcess from './lobby-components/GameProcess.jsx'

const Lobby = () => {
  const dispatch = useDispatch()

  Cookies.get('id') !== undefined
    ? console.log(Cookies.get('id'))
    : console.log(Cookies.set('id', Date.now()))

  const lobbyId = queryString.parse(location.search)
  console.log(queryString.parse(location.search))

  //Обновления лобби
  useEffect(() => {
    const resp = ref(db, 'lobbies/' + lobbyId.id)
    return onValue(resp, (snapshot) => {
      const data = snapshot.val()
      if (snapshot.exists()) {
        dispatch(initLobby({ ...data, lobbyId: lobbyId.id }))
        data.players.map((player) => {
          Cookies.get('id') === player.id && dispatch(initUser(player))
        })
      }
    })
  }, [])

  const lobby = useSelector((state) => state.lobby.lobby)
  const user = useSelector((state) => state.user.user)

  return (
    <>
      <div className="S_Lobby">
        <div className="W_LobbyInfo">
          <PlayersList />
        </div>
        <div className="GameBoard">
          <GameStatusBar />
          <GameProcess />
        </div>
      </div>
    </>
  )
}

export default Lobby
