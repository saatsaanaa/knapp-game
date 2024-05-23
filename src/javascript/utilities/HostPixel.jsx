import React, { useEffect } from "react";

import {
  ref,
  onChildAdded,
  query,
  orderByChild,
  equalTo,
  limitToLast,
} from "firebase/database";
import { db } from "../firebaseConfig";

import { processAction } from "../processAction.jsx";

import { useSelector } from "react-redux";

const HostPixel = () => {
  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);
  console.log("Я администрулькин");

  useEffect(() => {
    return onChildAdded(
      query(
        ref(db, "actions"),
        orderByChild("gameId"),
        equalTo(lobby.lobbyId),
        limitToLast(1)
      ),
      (data) => {
        const action = data.val();
        const actionKey = data.key;
        !action.processed
          ? processAction(action, actionKey, lobby, user)
          : "Экшен уже обработан";
      }
    );
  });
  return <></>;
};

export default HostPixel;
