import { Link } from "lucide-react";
import React from "react";

import { useSelector } from "react-redux";
import { sendAction } from "../../sendAction.jsx";

import "./GameBoard.scss";
import isApproveExisting from "../../utilities/isApproveExisting.jsx";

const GameBoard = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  function cardState() {
    if (user.isCurrentPlayer) {
      return "Card active";
    } else {
      return "Card";
    }
  }

  if (lobby.stage === "wait") {
    return (
      <div className="GameBoard">
        <p className="Headline">
          Пригласите других игроков, <br /> отправив им ссылку-приглашение
          <Link />
        </p>
      </div>
    );
  } else if (lobby.stage === "game") {
    return (
      <div className="GameBoard">
        {lobby.game.approves !== undefined && (
          <div className="approves-container">
            {Object.values(lobby.game.approves).map((approve) => (
              <div className="approve">
                <p className="Body-2">
                  <span>Игрок {" " + approve.name + " "} подтвердил ход</span>
                </p>
              </div>
            ))}
          </div>
        )}
        <div
          className={`Card truth
          ${user.isCurrentPlayer ? " for-current-player" : " for-spectator"}${
            lobby.game.status === "pick" ? " active" : ""
          }${
            lobby.game.status === "true" || lobby.game.previousStatus === "true"
              ? " choosen"
              : ""
          }`}
          onClick={() => {
            if (lobby.game.status === "pick" && user.isCurrentPlayer) {
              sendAction("PICK_TRUE", lobby, user);
            }
          }}
        >
          {lobby.game.status === "pick" && <p className="Title-1">Правда</p>}
          {(lobby.game.status === "true" ||
            lobby.game.previousStatus === "true") && (
            <p className="Body-1">{lobby.game.currentPair[1]}</p>
          )}
        </div>

        {/**------------ДЕЙСТВИЕ---------------*/}
        <div
          className={`Card dare${
            user.isCurrentPlayer ? " for-current-player" : " for-spectator"
          }${lobby.game.status === "pick" ? " active" : ""}${
            lobby.game.status === "dare" || lobby.game.previousStatus === "dare"
              ? " choosen"
              : ""
          }`}
          onClick={() => {
            if (user.isCurrentPlayer) {
              if (
                lobby.game.status === "pick" ||
                lobby.game.status === "true"
              ) {
                sendAction("PICK_DARE", lobby, user);
              }
            }
          }}
        >
          {(lobby.game.status === "pick" || lobby.game.status === "true") && (
            <p className="Title-1">Действие</p>
          )}
          {(lobby.game.status === "dare" ||
            lobby.game.previousStatus === "dare") && (
            <p className="Body-1">{lobby.game.currentPair[2]}</p>
          )}
        </div>
      </div>
    );
  }
};

export default GameBoard;
