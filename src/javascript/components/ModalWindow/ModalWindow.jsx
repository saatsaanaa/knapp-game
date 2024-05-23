import React from "react";
import "./ModalWindow.scss";

const ModalWindow = ({ children }) => {
  return (
    <div className="ModalWindow">
      <div>{children}</div>
    </div>
  );
};

export default ModalWindow;
