import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      width: '100%',
      backgroundColor: 'primary.main'
    }}>
      Content
    </Box>
  )
}

export default BoardContent
