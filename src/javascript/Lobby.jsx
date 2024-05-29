import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import queryString from "query-string";

import { initUser } from "../store/userSlice.js";

import { processAction } from "./processAction.jsx";

import { createQueue } from "../store/gameSlice.js";

/*Иконки */

/*Компоненты*/
import PlayersList from "./components/PlayersList/PlayersList.jsx";
import GameStatusBar from "./lobby-components/GameStatusBar/GameStatusBar.jsx";
import GameProcess from "./lobby-components/GameProcess.jsx";
/**/
import { sendAction } from "./sendAction.jsx";
import Input from "./components/Input/Input.jsx";
import isUserExisting from "./utilities/isUserExisting.jsx";
import LoadingLobby from "./utilities/LoadingLobby.jsx";
import isCurrentPlayer from "./utilities/isCurrentPlayer.jsx";
import HostPixel from "./utilities/HostPixel.jsx";
import GameStatus from "./components/GameStatus/GameStatus.jsx";
import { Link } from "lucide-react";
import GameBoard from "./components/GameBoard/GameBoard.jsx";
import Button from "./components/Button/Button.jsx";

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
          isCurrentPlayer: isCurrentPlayer(lobby, userId),
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
                  content: <>{location.reload()}</>,
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
  }, [lobby]);

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
        <GameBoard />
        <div className="LobbyInfo">
          <div className="Info">
            <div className="lobby-link">
              <p className="link">
                Лобби #{queryString.parse(location.search).id} 
              </p>
              <Link size={18} color="#2a1efb"/>
            </div>
            <p className="Body-2">Колода "Познакомимся?"</p>
          </div>
          <GameStatus />
          <PlayersList></PlayersList>
        </div>
        <div className="Menu">
          <div className="logo"/>
          <p className="link">Правила</p>
          <Button>Покинуть игру</Button>
        </div>
      </div>
      {user.role === "host" ? <HostPixel /> : console.log("Не хост")}
    </>
  );
};

export default Lobby;
