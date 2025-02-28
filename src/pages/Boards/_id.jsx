import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { mapOrder } from '~/utils/sort'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI, updateCardInTheSameColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67b9dd65ef4a5f8e62700935'
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id' )
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      setBoard(board)

    })
  }, [])

  const createNewColumn = async( newColumnData ) => {
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdNewColumn.cards = [generatePlaceholderCard(createdNewColumn)]
    createdNewColumn.cardOrderIds = [generatePlaceholderCard(createdNewColumn)._id]

    const newBoard = { ...board }
    newBoard.columns.push(createdNewColumn)
    newBoard.columnOrderIds.push(createdNewColumn._id)
    setBoard(newBoard)
    //console.log(createdNewColumn)
  }

  const createNewCard = async( newCardData ) => {
    const createdNewCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    const newBoard = { ...board }

    newBoard.columns.find(column => column._id === createdNewCard.columnId).cards.push(createdNewCard)
    newBoard.columns.find(column => column._id === createdNewCard.columnId).cardOrderIds.push(createdNewCard._id)
    setBoard(newBoard)
    //console.log(createdNewCard)
  }

  const moveColumns = async ( dndOrderColumns ) => {
    const dndOrderColumnIds = dndOrderColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnIds
    setBoard(newBoard)

    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds : dndOrderColumnIds })
  }

  const moveCardsInTheSameColumn = async ( dndOrderCards, dndOrderCardIds, columnId ) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cardOrderIds = dndOrderCardIds
      columnToUpdate.cards = dndOrderCards
    }
    setBoard(newBoard)
    await updateCardInTheSameColumnAPI(columnId, { cardOrderIds : dndOrderCardIds })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height :'100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardsInTheSameColumn={moveCardsInTheSameColumn}
      />
    </Container>
  )
}

export default Board
