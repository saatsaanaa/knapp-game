import React from "react";

import { useSelector } from "react-redux";

import { ref, update } from "firebase/database";
import { db } from "../firebaseConfig";
import { sendAction } from "../sendAction.jsx";
import { getFromAirTable } from "../airtableConfig.js";
import { Link } from "lucide-react";

const GameProcess = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  /*Проверки*/

  const isStatus = (whatNeed) => {
    return lobby.game.status === whatNeed;
  };

  if (lobby.stage === "wait") {
    return (
      <div className="GameProcess">
        <p className="A_Title medium">
          Пригласите других игроков, используя{" "}
          <a>
            ссылку приглашение <Link />
          </a>
        </p>
      </div>
    );
  } else if (lobby.stage === "game" && Object.hasOwn(lobby, "game")) {
    /**
     *
     *
     * Если ЮЗЕР ХОДИТ     */
    if (user.id === lobby.game.currentPlayerId) {
      return (
        <div className="GameProcess">
          {(isStatus("pick") || isStatus("true")) && (
            <div
              className={isStatus("true") ? "Card choosed" : "Card clickable"}
              onClick={() => sendAction("PICK_TRUE", lobby, user)}
            >
              {isStatus("true") ? lobby.game.currentPair[1] : "Правда"}
            </div>
          )}

          {(isStatus("pick") || isStatus("dare")) && (
            <div
              className={isStatus("dare") ? "Card choosed" : "Card clickable"}
              onClick={() => sendAction("PICK_DARE", lobby, user)}
            >
              {isStatus("dare") ? lobby.game.currentPair[2] : "Действие"}
            </div>
          )}

          {Object.hasOwn(lobby.game, "approves") && (
            <div className="Approves">
              {Object.values(lobby.game.approves).map((approve) => {
                return (
                  <div>
                    Игрок {approve.name} <br /> подтвердил ход
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
      /**
       *
       *
       * Если ЮЗЕР НЕ ХОДИТ     */
    } else {
      return (
        <div className="GameProcess">
          {(isStatus("pick") || isStatus("true")) && (
            <div
              className={
                isStatus("true") ? "Card choosed disabled" : "Card disabled"
              }
            >
              {isStatus("true") ? lobby.game.currentPair[1] : "Правда"}
            </div>
          )}

          {(isStatus("pick") || isStatus("dare")) && (
            <div
              className={
                isStatus("dare") ? "Card choosed disabled" : "Card disabled"
              }
            >
              {isStatus("dare") ? lobby.game.currentPair[2] : "Действие"}
            </div>
          )}
          {Object.hasOwn(lobby.game, "approves") && (
            <div className="Approves">
              {Object.values(lobby.game.approves).map((approve) => {
                return (
                  <div>
                    Игрок {approve.name} <br /> подтвердил ход
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  } else if (lobby.stage === "end") {
    return (
      <div className="GameProcess">
        <p className="A_Paragraph large">
          Сейчас только одна колода. Но появятся и другие, следите за новостями!
        </p>
      </div>
    );
  } else {
    return <p>Все сломалось</p>;
  }
};

export default GameProcess;
