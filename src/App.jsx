import Button from '@mui/material/Button'
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import { pink } from '@mui/material/colors'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'
function App() {

  return (
    <>
      <div>hi</div>
      <Typography variant='h2' color='primary'>jđjjđjdddddd</Typography>
      <Button variant="contained">Hello world</Button>
      <AccessAlarm />
      <ThreeDRotation />
      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
      <HomeIcon sx={{ color: pink[500] }} />
    </>
  )
}

export default App
