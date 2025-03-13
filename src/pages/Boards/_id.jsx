import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import {
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateCardInTheSameColumnAPI,
  updateCardInDiffColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard, fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'

const Board = () => {
  //const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  useEffect(() => {
    const boardId = '67b9dd65ef4a5f8e62700935'
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch])

  const createNewColumn = async( newColumnData ) => {
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdNewColumn.cards = [generatePlaceholderCard(createdNewColumn)]
    createdNewColumn.cardOrderIds = [generatePlaceholderCard(createdNewColumn)._id]

    //fix immuation of redux
    //const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdNewColumn)
    newBoard.columnOrderIds.push(createdNewColumn._id)
    // setBoard(newBoard)
    //console.log(createdNewColumn)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  const createNewCard = async( newCardData ) => {
    const createdNewCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //fix immutation in redux
    //const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdNewCard.columnId)
    if (columnToUpdate) {
      // Nếu column rỗng: bản chất là đang chứa một cái Placeholder card
      if (columnToUpdate.cards.some(card => card.FE_Placeholder )) {
        columnToUpdate.cards = [createdNewCard]
        columnToUpdate.cardOrderIds = [createdNewCard._id]
      } else {
        // Ngược lại column đã có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdNewCard)
        columnToUpdate.cardOrderIds.push(createdNewCard._id)
      }
    }
    // setBoard(newBoard)
    //console.log(createdNewCard)
    dispatch(updateCurrentActiveBoard(newBoard))

  }

  const moveColumns = async ( dndOrderColumns ) => {
    const dndOrderColumnIds = dndOrderColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds : dndOrderColumnIds })
  }

  const deleteDetailColumn = ( columnId ) => {
    const orderColumn = board.columns.filter(column => column._id !== columnId)
    const newBoard = { ...board }
    newBoard.columns = orderColumn
    newBoard.columnOrderIds = orderColumn.map(column => column._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deletedResult)
    })
  }

  const moveCardsInTheSameColumn = async ( dndOrderCards, dndOrderCardIds, columnId ) => {
    //fix immutation in redux
    //const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cardOrderIds = dndOrderCardIds
      columnToUpdate.cards = dndOrderCards
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    await updateCardInTheSameColumnAPI(columnId, { cardOrderIds : dndOrderCardIds })
  }

  const moveCardsToDiffColumn = ( currentCardId, prevColumnId, nextColumnId, dndOrderedColumns ) => {
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds
    //console.log('🚀 ~ moveCardsToDiffColumn ~ prevCardOrderIds:', prevCardOrderIds)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    updateCardInDiffColumnAPI({
      currentCardId,
      prevColumnId,
      nextColumnId,
      prevCardOrderIds: prevCardOrderIds,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId).cardOrderIds
    }
    )
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
        moveCardsToDiffColumn={moveCardsToDiffColumn}
        deleteDetailColumn={deleteDetailColumn}
      />
    </Container>
  )
}

export default Board
