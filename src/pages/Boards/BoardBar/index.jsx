import Box from '@mui/material/Box'

const BoardBar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      backgroundColor: 'primary.dark'
    }}>
      Board
    </Box>
  )
}

export default BoardBar
