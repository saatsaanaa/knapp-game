import React from "react";
import { useSelector } from "react-redux";

const StatusLabel = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  const isLobbyStageGame = (lobby) => {
    return lobby.stage === "game" && Object.hasOwn(lobby, "game");
  };

  const Waiting = () => {
    return <p className="A_Title large">Ожидание игроков...</p>;
  };

  const Game = () => {
    const Turn = () => {
      {
        user.isCurrentPlayer ? (
          <>
            <p className="A_Title large">Ваш ход</p>
            <p className="A_Title">Выберите правду или действие</p>
          </>
        ) : (
          <p className="A_Title large">
            Ход игрока{" "}
            {
              lobby.players.filter((player) => {
                return player.id === lobby.game.currentPlayerId;
              }).name
            }
          </p>
        );
      }
    };

    const PassTurn = () => {
      {
        user.isCurrentPlayer ? (
          <>
            <p className="A_Title medium">Ваш ход</p>
            <p className="A_Title">Выберите правду или действие</p>
          </>
        ) : (
          <p>Не ваш ход</p>
        );
      }
    };

    return (
      <>
        <Turn />
        {/*user.isCurrentPlayer ? (
          <>
            <p className="A_Title medium">Ваш ход</p>
            <p className="A_Title">Выберите правду или действие</p>
          </>
        ) : (
          <p>Не ваш ход</p>
        )*/}
      </>
    );
  };

  return (
    <div className="StatusLabel">
      {lobby.stage === "wait" ? (
        <Waiting />
      ) : isLobbyStageGame(lobby) ? (
        <Game />
      ) : (
        <p>StatusLabel сломался</p>
      )}
    </div>
  );
};

export default StatusLabel;
