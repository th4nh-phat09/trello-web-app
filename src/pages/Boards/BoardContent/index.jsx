import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      width: '100%',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      Content
    </Box>
  )
}

export default BoardContent
