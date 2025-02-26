import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis'
const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67b9dd65ef4a5f8e62700935'
    fetchBoardDetailsAPI(boardId).then(board => setBoard(board))
  }, [])

  const createNewColumn = async( newColumnData ) => {
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    console.log(createdNewColumn)}

  const createNewCard = async( newCardData ) => {
    const createdNewCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    console.log(createdNewCard)}

  return (
    <Container disableGutters maxWidth={false} sx={{ height :'100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
