import { configureStore } from '@reduxjs/toolkit'
import lobbyReducer from './lobbySlice'
import userReducer from './userSlice'

export default configureStore({
  reducer: {
    lobby: lobbyReducer,
    user: userReducer
  }
})
