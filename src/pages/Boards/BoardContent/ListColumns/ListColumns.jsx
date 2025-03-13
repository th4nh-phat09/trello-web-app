import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { createNewColumnAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


const ListColumns = ({ columns }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const dispatch =useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const addNewColumn = async() => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    //convert to redux
    //await createNewColumn({ title: `${newColumnTitle}` })
    const createdNewColumn = await createNewColumnAPI({
      title: newColumnTitle,
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
    //console.log(columns)
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  //SortableContext: A wrapper that groups sortable elements together
  return (
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        display: 'flex',
        bgcolor: 'inherit',
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
        height: '100%',
        '&::-webkit-scrollbar-track': { m :2 }
      }}>
        {/* column */}
        {columns?.map(column => <Column key={column?._id}
          column={column}/> )}

        {!openNewColumnForm ?
          <Box onClick={ toggleOpenNewColumnForm } sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
                Add new column
            </Button>
          </Box> :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              autoFocus
              variant='outlined'
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                } }}/>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={ addNewColumn }
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>

          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns