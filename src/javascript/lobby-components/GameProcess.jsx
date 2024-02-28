import React from "react";

import { useSelector } from "react-redux";

import { ref, update } from "firebase/database";
import { db } from "../firebaseConfig";
import { sendAction } from "../sendAction.jsx";

const GameProcess = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  /*Проверки*/

  const isLobbyStageGame = (lobby) => {
    return lobby.stage === "game" && Object.hasOwn(lobby, "game");
  };

  const isStatus = (whatNeed) => {
    return lobby.game.status === whatNeed;
  };

  const isCurrentPlayer = () => {
    return user.id === lobby.game.currentPlayerId;
  };

  /*Компоненты*/

  const Default = () => {
    return (
      <p className="A_Title">
        Пригласите других игроков, используя ссылку приглашение
      </p>
    );
  };

  return (
    <div className="GameProcess">
      {lobby.stage === "wait" ? (
        <Default />
      ) : isLobbyStageGame(lobby) ? (
        <>
          {(isStatus("pick") || isStatus("true")) && (
            <div
              className={isStatus("true") ? "Card choosed" : "Card"}
              onClick={() => sendAction("PICK_TRUE", lobby, user)}
            >
              {isStatus("true") ? "Какой ваш любимый цвет?" : "Правда"}
            </div>
          )}

          {(isStatus("pick") || isStatus("dare")) && (
            <div
              className={isStatus("dare") ? "Card choosed" : "Card"}
              onClick={() => sendAction("PICK_DARE", lobby, user)}
            >
              {isStatus("dare") ? "Покажите ваш любимый мем" : "Действие"}
            </div>
          )}
        </>
      ) : (
        "Все сломалось"
      )}
    </div>
  );
};

export default GameProcess;
