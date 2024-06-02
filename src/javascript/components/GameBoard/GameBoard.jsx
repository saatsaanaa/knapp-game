import { Link, Loader } from "lucide-react";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import { sendAction } from "../../sendAction.jsx";

import "./GameBoard.scss";
import isApproveExisting from "../../utilities/isApproveExisting.jsx";
import Deck from "../Deck.jsx";
import ModalWindow from "../ModalWindow/ModalWindow.jsx";
import Button from "../Button/Button.jsx";

const GameBoard = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  if (lobby.stage === "wait") {
    return (
      <div className="GameBoard wait-game">
        <p className="Title-1">Пригласите других игроков</p>
        <p className="Headline">
          Они могут присоединиться <br /> по{" "}
          <span
            onClick={() => {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                  console.log(window.location.href);
                })
                .catch((err) => console.error(err));
            }}
          >
            ссылке-приглашению
            <Link />
          </span>
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
  } else if (lobby.stage === "end") {
    return (
      <div className="GameBoard state-end">
        {user.role === "host" ? (
          <>
            {[
              {
                name: "Колода 1",
                description: "Какая-то колодв",
              },
              {
                name: "Колода 2",
                description: "Какая-то колодв",
              },
              {
                name: "Колода 3",
                description: "Какая-то колодв",
              },
            ].map((deck, index) => (
              <Deck>
                <>
                  <p key={index} className="Headline">
                    {deck.name}
                  </p>
                  <p className="Body-1">{deck.description}</p>
                </>
              </Deck>
            ))}
          </>
        ) : (
          <Loader color={"#6600ff"} size={50} />
        )}
      </div>
    );
  } else if (lobby.stage === "end_no-user") {
    return (
      <>
        <div className="GameBoard"></div>
        {user.role === "host" && (
          <ModalWindow>
            <div>
              <p className="Title-1">Вы удалили всех игроков</p>
              <p className="Body-1">Игра автоматически завершилась</p>
              <div className="button-group">
                <Button
                  onClick={() => (document.location.href = "../index.html")}
                  appearance={"negative"}
                >
                  Покинуть лобби
                </Button>
                <Button onClick={() => sendAction("RESTART_GAME", lobby, user)}>
                  Начать заново
                </Button>
              </div>
            </div>
          </ModalWindow>
        )}
      </>
    );
  }
};

export default GameBoard;
