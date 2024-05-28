import React from "react";
import "./Input.scss";

const Input = ({ name, onInput, required, maxLength, children }) => {
  required == undefined && (required = false);
  maxLength == undefined && (maxlength = 300);
  return (
    <input
      name={name}
      required={required}
      maxLength={maxLength}
      onInput={onInput}
      placeholder={children}
    ></input>
  );
};

export default Input;
