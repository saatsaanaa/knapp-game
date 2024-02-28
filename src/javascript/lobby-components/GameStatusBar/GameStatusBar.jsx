import React from "react";
import { useSelector } from "react-redux";

import { sendAction } from "../../sendAction.jsx";

const GameStatusBar = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  const isLobbyStageGame = (lobby) => {
    return lobby.stage === "game" && Object.hasOwn(lobby, "game");
  };

  if (lobby.stage === "wait") {
    return (
      <div className="GameStatusBar">
        <div className="StatusLabel">
          <p className="A_Title large">Ожидание игроков...</p>
        </div>
        {user.isHost && (
          <button
            className="A_Button green"
            disabled={lobby.players.length < 2}
            onClick={() => sendAction("START_GAME", lobby, user)}
          >
            Начать игру
          </button>
        )}
      </div>
    );
  } else if (isLobbyStageGame(lobby)) {
    if (user.isCurrentPlayer) {
      /**
       *
       *
       * Если пользователь сейчас ХОДИТ*/
      if (lobby.game.status !== "PASS_TURN") {
        //Если идет ход
        return (
          <div className="GameStatusBar">
            <div className="StatusLabel">
              <p className="A_Title large">Ваш ход</p>
              {lobby.game.status === "pick" ? (
                <p className="A_Paragraph large">
                  Выберите правду или действие
                </p>
              ) : (
                lobby.game.status === "true" && (
                  <p className="A_Paragraph large">
                    Если вам не нравится вопрос, вы можете сменить его на
                    действие
                  </p>
                )
              )}
            </div>
          </div>
        );
      } else {
        // Переход хода
        return (
          <div className="GameStatusBar">
            <div className="StatusLabel">
              {lobby.game.previousStatus == "true" ? (
                <p className="A_Title large">Вы ответили на вопрос</p>
              ) : (
                lobby.game.previousStatus == "dare" && (
                  <p className="A_Title large">Вы выполнили действие</p>
                )
              )}
            </div>
            <p className="A_Paragraph large">
              Ход переходит к следующему игроку
            </p>
          </div>
        );
      }
    } else {
      /**
       *
       *
       * Если пользователь сейчас НЕ ХОДИТ*/
      if (lobby.game.status !== "PASS_TURN") {
        return (
          <div className="GameStatusBar">
            <div className="StatusLabel">
              <p className="A_Title large">
                Ход игрока{" "}
                <span>
                  {
                    lobby.players.filter((player) => {
                      return player.id === lobby.game.currentPlayerId;
                    })[0].name
                  }
                </span>
              </p>
            </div>
            <button
              className="A_Button green"
              disabled={lobby.game.status === "pick"}
              onClick={() => sendAction("APPROVE_TURN", lobby, user)}
            >
              Игрок сходил
            </button>
          </div>
        );
      } else {
        // Переход хода
        return (
          <div className="GameStatusBar">
            <div className="StatusLabel">
              <p className="A_Title large">
                Игрок{" "}
                <span>
                  {
                    lobby.players.filter((player) => {
                      return player.id === lobby.game.currentPlayerId;
                    })[0].name
                  }
                </span>
                {lobby.game.previousStatus == "true"
                  ? " ответил на вопрос"
                  : lobby.game.previousStatus == "dare" && " выполнил действие"}
              </p>
            </div>
            <p className="A_Paragraph large">
              Ход переходит к следующему игроку
            </p>
          </div>
        );
      }
    }
  } else {
    return (
      <div className="gameStatusBar">
        <div className="StatusLabel">
          <p className="A_Title large">Состояние лобби не определено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="GameStatusBar">
      {lobby.stage === "wait" ? (
        <>
          <div className="StatusLabel">
            <p className="A_Title large">Ожидание игроков...</p>
          </div>
          {user.isHost && (
            <button
              className="A_Button green"
              disabled={lobby.players.length < 2}
              onClick={() => sendAction("START_GAME", lobby, user)}
            >
              Начать игру
            </button>
          )}
        </>
      ) : isLobbyStageGame(lobby) ? (
        user.isCurrentPlayer ? (
          <>
            <div className="StatusLabel">
              <p className="A_Title large">Ваш ход</p>
              {lobby.game.status === "pick" ? (
                <p className="A_Paragraph large">
                  Выберите правду или действие
                </p>
              ) : (
                lobby.game.status === "true" && (
                  <p className="A_Paragraph large">
                    Если вам не нравится вопрос, вы можете сменить его на
                    действие
                  </p>
                )
              )}
            </div>
          </>
        ) : (
          <>
            <div className="StatusLabel">
              <p className="A_Title large">
                Ход игрока{" "}
                <span>
                  {
                    lobby.players.filter((player) => {
                      return player.id === lobby.game.currentPlayerId;
                    })[0].name
                  }
                </span>
              </p>
            </div>
            <button
              className="A_Button green"
              disabled={lobby.game.status === "pick"}
              onClick={() => sendAction("APPROVE_TURN", lobby, user)}
            >
              Игрок сходил
            </button>
          </>
        )
      ) : (
        <p>lobby.stage не определен</p>
      )}
      {/*<StatusLabel />*/}

      {/*lobby.stage === "wait" ? (
        user.isHost && (
          <button
            className="A_Button green"
            disabled={lobby.players.length < 2}
            onClick={() => sendAction("START_GAME", lobby, user)}
          >
            Начать игру
          </button>
        )
      ) : isLobbyStageGame(lobby) ? (
        !user.isCurrentPlayer && (
          <button
            className="A_Button green"
            disabled={lobby.game.status === "pick"}
            onClick={() => sendAction("APPROVE_TURN", lobby, user)}
          >
            Игрок сходил
          </button>
        )
      ) : (
        <p>StatusLabel сломался</p>
      )*/}
      {/*lobby.stage === "wait" ? (
        <>
          <div className="StatusLabel">
            <p className="A_Title large">Ожидание игроков...</p>
          </div>
          {user.isHost && (
            <button
              className="A_Button green"
              disabled={lobby.players.length < 2}
              onClick={() => sendAction("START_GAME", lobby, user)}
            >
              Начать игру
            </button>
          )}
        </>
      ) : lobby.stage === "game" && user.isCurrentPlayer ? (
        <MyTurn />
      ) : (
        <Turn />
      )*/}
    </div>
  );
};

export default GameStatusBar;
