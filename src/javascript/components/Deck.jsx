import React, { useState } from "react";

const Deck = ({ children, onClick, isSelected }) => {
  return (
    <div
      className={`deck${isSelected ? " selected" : ""}`}
      onClick={() => {
        onClick();
      }}
    >
      <div className="deck-background">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <div key={n} className={"rectangle-" + n}></div>
        ))}
      </div>
      <div className="deck-content">{children}</div>
    </div>
  );
};

export default Deck;
