import React from "react";
import { useSelector } from "react-redux";

import "./GameStatus.scss";
import Button from "../Button/Button.jsx";
import { sendAction } from "../../sendAction.jsx";

const GameStatus = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);
  console.log(user);
  console.log(lobby);

  //Ожидание игры
  if (lobby.stage === "wait") {
    return (
      <div className="GameStatus">
        <p className="Title-2">Ожидание игроков</p>
        <Button
          disabled={user.role !== "host" || lobby.players.length < 2}
          onClick={() => sendAction("START_GAME", lobby, user)}
        >
          Начать игру
        </Button>
      </div>
    );
  } else if (lobby.stage === "game") {
    return (
      <div className="GameStatus">
        <p className="Title-2">
          {user.isCurrentPlayer
            ? "Ваш ход"
            : `Ход игрока ${
                lobby.players.filter((player) => {
                  return player.id === lobby.game.currentPlayerId;
                })[0].name
              }`}
        </p>
        <Button
          disabled={user.role !== "host" || lobby.players.length < 2}
          onClick={() => sendAction("START_GAME", lobby, user)}
        >
          Начать игру
        </Button>
      </div>
    );
  }
};

export default GameStatus;
