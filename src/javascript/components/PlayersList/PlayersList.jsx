import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./PlayersList.scss";

import { Gem } from "lucide-react";
import { X } from "lucide-react";
import ModalWindow from "../ModalWindow/ModalWindow.jsx";
import Button from "../Button/Button.jsx";
import { sendAction } from "../../sendAction.jsx";

const PlayersList = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [infoOpen, setInfoOpen] = useState(false);
  const [modalWindow, setModalWindow] = useState({ show: false, player: "" });

  return (
    <>
      <div
        className={`PlayersList${infoOpen ? " open" : ""}`}
        onTouchStart={() => setInfoOpen(!infoOpen)}
      >
        <hr />
        <div className="header">
          <p className="Headline">Участники</p>
          <p className="Headline blue">{lobby.players.length}/8</p>
        </div>
        <div className="players-container">
          {lobby.players.map((player) => (
            <div key={player.id} className="PlayerItem">
              <div>
                <p className="Body-1">{player.name}</p>
                <p className="Body-1 blue">
                  {player.id === lobby.hostId
                    ? "Хост"
                    : user.role === "host" && (
                        <X
                          onClick={() => {
                            console.log("Удалить игрока");
                            setModalWindow({
                              show: !modalWindow.show,
                              player: player,
                            });
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalWindow.show && (
        <ModalWindow>
          <div>
            <div className="modal-header">
              <X
                onClick={() => setModalWindow({ show: false, player: "" })}
                size={32}
              />
            </div>
            <p className="Title-1">
              Забанить игрока <br />
              {modalWindow.player.name}?
            </p>
            <p className="Body-1">
              Он больше не сможет присоединиться к этому лобби
            </p>

            <Button
              appearance="negative"
              onClick={() => {
                sendAction(`DELETE_USER_${modalWindow.player.id}`, lobby, user);
                setModalWindow({ show: false, player: "" });
              }}
            >
              Выгнать игрока
            </Button>
          </div>
        </ModalWindow>
      )}
    </>
  );
};

export default PlayersList;
