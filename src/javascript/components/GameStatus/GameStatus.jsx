import React from "react";
import { useSelector } from "react-redux";

import "./GameStatus.scss";
import Button from "../Button/Button.jsx";
import { sendAction } from "../../sendAction.jsx";
import isApproveExisting from "../../utilities/isApproveExisting.jsx";

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
        {user.role === "host" && (
          <Button
            disabled={lobby.players.length < 2}
            onClick={() => sendAction("START_GAME", lobby, user)}
          >
            Начать игру
          </Button>
        )}
      </div>
    );
  } /// Игра идет
  else if (lobby.stage === "game") {
    if (user.isCurrentPlayer) {
      if (lobby.game.status === "pick") {
        return (
          <div className="GameStatus">
            <div className="status-container">
              <p className="Title-2">
                <span>Ваш ход</span>
              </p>
              <p className="Body-2">Выберите карту</p>
            </div>

            <Button disabled={true}>Передать ход</Button>
          </div>
        );
      } else if (lobby.game.status === "true") {
        return (
          <div className="GameStatus">
            <div className="status-container">
              <p className="Title-2">
                <span>Ваш ход</span>
              </p>
              <p className="Body-2">Вы можете поменять правду на действие</p>
            </div>

            <Button disabled={true}>Передать ход</Button>
          </div>
        );
      } else if (lobby.game.status === "dare") {
        return (
          <div className="GameStatus">
            <p className="Title-2">
              <span>Ваш ход</span>
            </p>

            <Button disabled={true}>Передать ход</Button>
          </div>
        );
      } else if (lobby.game.status == "PASS_TURN") {
        return (
          <div className="GameStatus">
            <p className="Title-2">
              {lobby.game.previousStatus == "true"
                ? "Вы ответили на вопрос"
                : lobby.game.previousStatus == "dare" &&
                  "Вы выполнили действие"}
            </p>
          </div>
        );
      }
    } else if (
      lobby.game.status === "dare" ||
      lobby.game.status === "pick" ||
      lobby.game.status === "true"
    ) {
      return (
        <div className="GameStatus">
          <div className="status-container">
            <p className="Title-2">
              Ход игрока
              <span>
                {" " +
                  lobby.players.filter((player) => {
                    return player.id === lobby.game.currentPlayerId;
                  })[0].name}
              </span>
            </p>
          </div>

          <Button
            disabled={
              lobby.game.status === "pick" ||
              isApproveExisting([lobby.game.approves, user.id])
            }
            onClick={() => {
              sendAction("APPROVE_TURN", lobby, user);
            }}
          >
            Подтвердить ход
          </Button>
        </div>
      );
    } else if (lobby.game.status == "PASS_TURN") {
      return (
        <div className="GameStatus">
          <p className="Title-2">
            {lobby.game.previousStatus == "true"
              ? "Игрок " +
                lobby.players.filter(
                  (player) => player.id === lobby.game.currentPlayerId
                )[0].name +
                " ответил на вопрос"
              : "Игрок " +
                lobby.players.filter(
                  (player) => player.id === lobby.game.currentPlayerId
                )[0].name +
                " выполнил действие"}
          </p>
        </div>
      );
    }
  }
};

export default GameStatus;
