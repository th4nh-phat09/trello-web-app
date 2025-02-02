import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

const BoardContent = ({ board }) => {
  const orderColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id' )
  return (
    <Box sx={{
      height: (theme) => theme.trello.boardContentHeight,
      width: '100%',
      p:'10px 0',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      {/* List Columns */}
      <ListColumns columns={orderColumns} />
    </Box>
  )
}

export default BoardContent
