import { useSelector, useDispatch } from 'react-redux'

export const chooseCurrentPlayer = () => {
  const lobby = useSelector((state) => state.lobby.lobby)

  console.log(lobby.players[0])
}
