import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./PlayersList.scss";

import { Gem } from "lucide-react";
import { X } from "lucide-react";

const PlayersList = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  return (
    <div className="C_PlayersList">
      <div className="header">
        <p className="A_Title medium">Участники</p>
        <p className="A_Title medium blue">{lobby.players.length}/8</p>
      </div>
      {lobby.players.map((player) => (
        <div key={player.id} className="O_PlayerItem">
          <div>
            <p className="A_Title small">{player.name}</p>
            <p className="A_Paragraph medium blue">
              {player.id === lobby.hostId
                ? "Хост"
                : user.isHost && <X style={{ cursor: "pointer" }} />}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersList;
