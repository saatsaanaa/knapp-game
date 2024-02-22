import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import queryString from 'query-string'

import { ref, update } from 'firebase/database'
import { db } from './../firebaseConfig.js'

const GameStatusBar = () => {
  const lobby = useSelector((state) => state.lobby.lobby)
  const user = useSelector((state) => state.user.user)
  const lobbyId = queryString.parse(location.search)

  const dispatch = useDispatch()

  const MyTurn = () => {
    return (
      <>
        <div className="StatusLabel">
          <p className="A_Title medium">Ваш ход</p>
          <p className="A_Title">Выберите правду или действие</p>
        </div>
      </>
    )
  }

  const WaitGame = () => {
    return (
      <>
        <div className="StatusLabel">
          <p className="A_Title medium">Ожидание игроков...</p>
        </div>
        {user.id === lobby.hostId && (
          <button
            className="A_Button green"
            disabled={lobby.players.length < 2}
            onClick={() => {
              const pickCurrPlayer = lobby.players[0].id

              update(ref(db, `lobbies/${lobby.lobbyId}`), { stage: 'game' })
              update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                currentPlayerId: pickCurrPlayer,
                status: 'pick'
              })
              console.log('hjbb')
            }}
          >
            Начать игру
          </button>
        )}
      </>
    )
  }

  const Turn = () => {
    return (
      <>
        <div className="StatusLabel">
          <p className="A_Title medium">
            Ход игрока
            <span>
              {lobby.players.map(
                (player) =>
                  player.id === lobby.game.currentPlayerId && ' ' + player.name
              )}
            </span>
          </p>
        </div>
        <button className="A_Button green" disabled>
          Игрок сходил
        </button>
      </>
    )
  }

  return (
    <div className="GameStatusBar">
      {lobby.stage === 'wait' && <WaitGame />}
      {lobby.stage === 'game' &&
        lobby.game.currentPlayerId !== undefined &&
        (user.id === lobby.game.currentPlayerId ? <MyTurn /> : <Turn />)}
    </div>
  )
}

export default GameStatusBar
