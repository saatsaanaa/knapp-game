import React from "react";
import "./Button.scss";

const Button = ({ onClick, appearance, disabled, type, children }) => {
  /*Проверяем наличие айди юзера*/
  disabled == undefined && (disabled = false);
  appearance == undefined ? (appearance = "") : (appearance = " " + appearance);
  type == undefined && (type = "button");
  return (
    <>
      <button
        className={`button` + appearance}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
