import React, { useEffect } from "react";

import {
  ref,
  onValue,
  onChildAdded,
  update,
  query,
  equalTo,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { db } from "../firebaseConfig";
import queryString from "query-string";

//Стор
import { useDispatch, useSelector } from "react-redux";
import { initLobby } from "../../store/lobbySlice";

const LoadingLobby = ({ children }) => {
  const dispatch = useDispatch();
  const lobby = useSelector((state) => state.lobby.lobby);

  useEffect(() => {
    console.log("Загружаем лобби");
    return onValue(
      ref(db, "lobbies/" + queryString.parse(location.search).id),
      (data) => {
        if (data.exists()) {
          //Закидываем данные о лобби в стор
          console.log("Данные с firebase:");
          console.log(data.val());
          dispatch(
            initLobby({
              ...data.val(),
              lobbyId: queryString.parse(location.search).id,
            })
          );
        }
      }
    );
  }, []);

  if (Object.keys(lobby).length !== 0) {
    return <>{children}</>;
  } else {
    return <p>Лобби загружается</p>;
  }
};

export default LoadingLobby;
