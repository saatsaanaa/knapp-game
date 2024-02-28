import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    game: {
      playersQueue: [],
    },
  },
  reducers: {
    createQueue(state, action) {
      console.log(action.payload);
      state.game.playersQueue.push(action.payload);
    },
  },
});

export const { createQueue } = gameSlice.actions;

export default gameSlice.reducer;
