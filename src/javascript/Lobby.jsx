import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import queryString from "query-string";

import { initUser } from "../store/userSlice.js";

import { processAction } from "./processAction.jsx";

import { createQueue } from "../store/gameSlice.js";

/*Компоненты*/
import PlayersList from "./lobby-components/PlayersList/PlayersList.jsx";
import GameStatusBar from "./lobby-components/GameStatusBar/GameStatusBar.jsx";
import GameProcess from "./lobby-components/GameProcess.jsx";
/**/
import { sendAction } from "./sendAction.jsx";
import Input from "./components/Input/Input.jsx";
import isUserExisting from "./utilities/isUserExisting.jsx";
import LoadingLobby from "./utilities/LoadingLobby.jsx";
import isCurrentPlayer from "./utilities/isCurrentPlayer.jsx";
import HostPixel from "./utilities/HostPixel.jsx";

/**
 * ЛОББИ
 * */
const Lobby = () => {
  const [modalWindow, setModalWindow] = useState({
    show: false,
    content: "Пусто",
  });
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  /** Получаем юзера из кук */
  const userId = Cookies.get("id");

  useEffect(() => {
    if (isUserExisting(lobby.players, userId)) {
      dispatch(
        initUser({
          ...lobby.players.filter((player) => {
            return player.id === userId;
          })[0],
          isCurrentPlayer: isCurrentPlayer(lobby.stage),
        })
      );
    } else {
      setModalWindow({
        show: true,
        content: (
          <>
            <p className="A_Title large">Присоединиться к лобби</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target);
                const formJson = Object.fromEntries(data.entries());
                console.log(formJson);
                sendAction(
                  "JOIN_LOBBY",
                  { lobbyId: queryString.parse(location.search).id },
                  { id: userId, name: formJson.name }
                );
                setModalWindow({
                  show: false,
                  content: (
                    <>
                      <p className="A_Title medium">Добавляем вас в лобби</p>
                    </>
                  ),
                });
              }}
            >
              <p className="A_Paragraph large">Придумайте ник</p>
              <input name="name" size="9" required></input>

              <button className="A_Button" type="submit">
                Присоединиться
              </button>
            </form>
          </>
        ),
      });
    }
  }, []);

  return (
    <>
      <div className="Lobby">
        {modalWindow.show ? (
          <div className="ModalWindow">
            <div>{modalWindow.content}</div>
          </div>
        ) : (
          ""
        )}
        <div className="GameBoard">kzkzkzk</div>
        <div className="LobbyInfo">
          <div className="Info">
            <p>Lobby Id</p>
            <p>Desk name</p>
          </div>
          <div className="GameStatus">
            <p>Очень ждем всех участников ы апривет</p>
            <p>Начать игру</p>
          </div>
          <div className="PlayersList">
            <p>Участники</p>

            {lobby.players.map((player) => {
              return (
                <div>
                  <p>{player.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="Menu">
          <p>LOGO</p>
          <p>Правила</p>
          <p>Кнопка</p>
        </div>
      </div>
      {user.role === "host" ? <HostPixel /> : console.log("Не хост")}
    </>
  );
};

export default Lobby;
