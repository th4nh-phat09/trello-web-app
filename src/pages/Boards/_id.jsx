import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateCardInTheSameColumnAPI,
  updateCardInDiffColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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


  const moveColumns = async ( dndOrderColumns ) => {
    const dndOrderColumnIds = dndOrderColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds : dndOrderColumnIds })
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
        moveColumns={moveColumns}
        moveCardsInTheSameColumn={moveCardsInTheSameColumn}
        moveCardsToDiffColumn={moveCardsToDiffColumn}
      />
    </Container>
  )
}

export default Board
