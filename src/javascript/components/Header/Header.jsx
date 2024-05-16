import React from "react";

import "./Header.scss";

import Button from "../../create-game-components/Button.jsx";
import Logo from "../../../imgs/knapp-logo.svg";

const Header = () => {
  return (
    <div className="Header">
      <a href="/">
        <img src={Logo} alt="" />
      </a>

      <div className="LinkGroup">
        <a href="/">Колоды</a>
        <a href="/">Правила игры</a>
        <a href="/">О проекте</a>
      </div>

      <Button />
    </div>
  );
};

export default Header;
