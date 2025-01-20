import Button from '@mui/material/Button'
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import { pink } from '@mui/material/colors'
import HomeIcon from '@mui/icons-material/Home'
function App() {

  return (
    <>
      <div>hi</div>
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
