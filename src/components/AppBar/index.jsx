import Box from '@mui/material/Box'
import SelectMode from '../ModeSelect'
const AppBar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      backgroundColor: 'primary.light'
    }}>
      <SelectMode />
    </Box>
  )
}

export default AppBar
