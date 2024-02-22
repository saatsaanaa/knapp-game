import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Gem } from 'lucide-react'
import { X } from 'lucide-react'

const PlayersList = () => {
  const lobby = useSelector((state) => state.lobby.lobby)
  const user = useSelector((state) => state.user.user)

  const dispatch = useDispatch()

  return (
    <div className="C_PlayersList">
      <div className="header">
        <p className="A_Title small">Участники</p>
        {lobby.hostId !== undefined && (
          <p className="A_Title small blue">{lobby.players.length}/8</p>
        )}
      </div>
      {lobby.hostId !== undefined &&
        lobby.players.map((player) => (
          <div key={player.id} className="O_PlayerItem">
            <div>
              <p className="A_Headline medium">{player.name}</p>
              <p className="blue">
                {player.id === lobby.hostId
                  ? 'Хост'
                  : lobby.hostId === user.id && (
                      <X style={{ cursor: 'pointer' }} />
                    )}
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default PlayersList
