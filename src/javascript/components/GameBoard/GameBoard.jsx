import { Link } from "lucide-react";
import React from "react";

import { useSelector } from "react-redux";
import { sendAction } from "../../sendAction.jsx";

import "./GameBoard.scss";

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
        <div
          className={`Card truth
          ${user.isCurrentPlayer ? " for-current-player" : " for-spectator"}${
            lobby.game.status === "pick" ? " active" : ""
          }${lobby.game.status === "true" ? " choosen" : ""}`}
          onClick={() => {
            if (lobby.game.status === "pick" && user.isCurrentPlayer) {
              sendAction("PICK_TRUE", lobby, user);
            }
          }}
        >
          {lobby.game.status === "pick" && <p className="Title-1">Правда</p>}
          {lobby.game.status === "true" && (
            <p className="Body-1">{lobby.game.currentPair[1]}</p>
          )}
        </div>
        <div
          className={`Card dare${
            user.isCurrentPlayer ? " for-current-player" : " for-spectator"
          }${lobby.game.status === "pick" ? " active" : ""}${
            lobby.game.status === "dare" ? " choosen" : ""
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
        </div>
      </div>
    );
    /*if (user.isCurrentPlayer) {
      return (
        <div className="GameBoard">
          <div
            className={cardState()}
            onClick={() => sendAction("PICK_TRUE", lobby, user)}
          >
            <p className="Title-1">Правда</p>
          </div>
          <div
            className={cardState()}
            onClick={() => sendAction("PICK_DARE", lobby, user)}
          >
            {lobby.game.status === "dare" ? (
              <p className="Body-1">{lobby.game.currentPair[2]}</p>
            ) : (
              <p className="Title-1">Действие</p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="GameBoard">
          <div className={cardState()}>
            <p className="Title-1">Правда</p>
          </div>
          <div className={cardState()}>
            <p className="Title-1">Действие</p>
          </div>
        </div>
      );
    }*/
  }

  /*return (
    <div className="GameBoard">
      {lobby.stage === "wait" ? (
        <p className="Headline">
          Пригласите других игроков, <br /> отправив им ссылку-приглашение
          <Link />
        </p>
      ) : (
        <>
          <div
            className={`Card true${user.isCurrentPlayer ? " clickable" : ""}`}
          >
            <p className="Title-1">Правда</p>
          </div>
          <div
            className={`Card dare${user.isCurrentPlayer ? " clickable" : ""}${
              lobby.game.status === "dare" ? " active" : ""
            }`}
          >
            <p className="Title-1">Действие</p>
          </div>
        </>
      )}
    </div>
  );*/
};

export default GameBoard;
