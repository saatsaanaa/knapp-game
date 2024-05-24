import React, { useState } from "react";

import Button from "./components/Button/Button.jsx";
import Logo from "../imgs/knapp-logo.svg";
import ModalWindow from "./components/ModalWindow/ModalWindow.jsx";

const Header = () => {
  const [modalWindow, setModalWindow] = useState({
    show: false,
    content: "Пусто",
  });

  return (
    <>
      <a href="/">
        <img src={Logo} alt="" />
      </a>

      <div className="LinkGroup">
        <a href="/">Колоды</a>
        <a href="/">Правила игры</a>
        <a href="/">О проекте</a>
      </div>

      <Button
        onClick={() => {
          console.log("Привет");
          setModalWindow({
            show: true,
            content: (
              <>
                <p className="A_Title large">Создаем лобби</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const formJson = Object.fromEntries(data.entries());
                    console.log(formJson);

                    setModalWindow({
                      show: true,
                      content: <p>Выбрана колода #{formJson.deck}</p>,
                    });
                  }}
                >
                  <p className="A_Paragraph large">Выберите колоду</p>
                  <div className="DeckContainer">
                    <div className="Deck">
                      <p>Название</p>
                      <p>Эта колода такая-то и такая-то'</p>
                    </div>
                    <div className="Deck">Колода 1</div>
                    <div className="Deck">Колода 1</div>
                  </div>

                  <button className="A_Button" type="submit">
                    Продолжить
                  </button>
                </form>
              </>
            ),
          });
        }}
      />

      {modalWindow.show && <ModalWindow>{modalWindow.content}</ModalWindow>}
    </>
  );
};

export default Header;