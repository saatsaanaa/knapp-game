import React, { useState } from "react";

import Button from "./components/Button/Button.jsx";
import Logo from "../imgs/knapp-logo.svg";
import ModalWindow from "./components/ModalWindow/ModalWindow.jsx";

const Header = () => {

  const desksList = [
    { 
      id: 1,
      name: 'Deck #1',
      description: 'Длинное или не очень описание колоды, темы вопросов и действий.'
    },
    { 
      id: 2,
      name: 'Deck #2',
      description: 'Длинное или не очень описание колоды, темы вопросов и действий.'
    },
    { 
      id: 3,
      name: 'Deck #3',
      description: 'Длинное или не очень описание колоды, темы вопросов и действий.'
    },
    { 
      id: 4,
      name: 'Deck #4',
      description: 'Длинное или не очень описание колоды, темы вопросов и действий.'
    }
  ]
  const [age, setAge] = useState(0)

  const [checkedCard, setCheckedCard] = useState()

  const [modalWindow, setModalWindow] = useState({
    show: false,
    content: "Пусто",
  });

  function chooseCard(desk) {
    console.log(desk.id);
    console.log(checkedCard);
    setCheckedCard(1);
    console.log(checkedCard)
  }

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
          setCheckedCard(1)
          setModalWindow({
            show: true,
            content: (
              <>
              {console.log(`Модалка отрендерилась`)}
                <p className="A_Title large">Создаем лобби</p>
                  <p className="A_Paragraph large">Выберите колоду</p>
                  <div className="DeckContainer">
                    {desksList.map((desk) => {
                      return (
                      <div 
                      className={`Deck ${checkedCard === desk.id && ' checked'}`} 
                      key={desk.id} 
                      onClick={() => {
                        console.log('Привет')
                        setAge(1);
                        console.log(age);
                        }}>
                      <p>{desk.name}</p>
                      <p className="A_Paragraph small">{desk.description}</p>
                      {console.log(`Карта №${desk.id} отрендерилась`)}
                    </div>)
                    })}
                  </div>

                  <button className="A_Button" type="submit">
                    Продолжить
                  </button>
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
