import React from 'react'

import { useSelector } from 'react-redux'

import { ref, update } from 'firebase/database'
import { db } from '../firebaseConfig'

const GameProcess = () => {
  const lobby = useSelector((state) => state.lobby.lobby)
  const user = useSelector((state) => state.user.user)

  /*Проверки*/

  const isStatus = (whatNeed) => {
    return lobby.game.status === whatNeed
  }

  const isCurrentPlayer = () => {
    return user.id === lobby.game.currentPlayerId
  }

  /*Компоненты*/

  const Default = () => {
    return (
      <p className="A_Title">
        Пригласите других игроков, используя ссылку приглашение
      </p>
    )
  }

  return (
    <div className="GameProcess">
      {lobby.stage === 'wait' && <Default />}
      {lobby.stage === 'game' && lobby.game.status !== undefined && (
        <>
          {(isStatus('pick') || isStatus('true')) && (
            <div
              className={isStatus('true') ? 'Card choosed' : 'Card'}
              onClick={() => {
                isStatus('pick') &&
                  isCurrentPlayer() &&
                  update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                    status: 'true'
                  })
              }}
            >
              {isStatus('true') ? 'Какой ваш любимый цвет?' : 'Правда'}
            </div>
          )}

          {(isStatus('pick') || isStatus('dare')) && (
            <div
              className={isStatus('dare') ? 'Card choosed' : 'Card'}
              onClick={() => {
                isStatus('pick') &&
                  isCurrentPlayer() &&
                  update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                    status: 'dare'
                  })
              }}
            >
              {isStatus('dare') ? 'Покажите ваш любимый мем' : 'Действие'}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GameProcess
