import { configureStore } from "@reduxjs/toolkit";
import lobbyReducer from "./lobbySlice";
import userReducer from "./userSlice";
import gameReducer from "./gameSlice";

export default configureStore({
  reducer: {
    lobby: lobbyReducer,
    user: userReducer,
    game: gameReducer,
  },
});
