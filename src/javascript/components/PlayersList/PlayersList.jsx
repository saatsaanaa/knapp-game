import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./PlayersList.scss";

import { Gem } from "lucide-react";
import { X } from "lucide-react";

const PlayersList = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div
      className={`PlayersList${infoOpen ? " open" : ""}`}
      onTouchStart={() => setInfoOpen(!infoOpen)}
    >
      <hr />
      <div className="header">
        <p className="Headline">Участники</p>
        <p className="Headline blue">{lobby.players.length}/8</p>
      </div>
      <div className="players-container">
        {lobby.players.map((player) => (
          <div key={player.id} className="PlayerItem">
            <div>
              <p className="Body-1">{player.name}</p>
              <p className="Body-1 blue">
                {player.id === lobby.hostId
                  ? "Хост"
                  : user.role === "host" && <X style={{ cursor: "pointer" }} />}
              </p>
            </div>
            <div>
              <p className="Body-2">Бонус смены вопроса</p>
              <p className="Body-2 blue">x0</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
