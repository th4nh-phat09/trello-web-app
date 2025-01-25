import Box from '@mui/material/Box'
import SelectMode from '../ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
const AppBar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      justifyContent: 'space-between',
      px: 2
    }}>
      {/* Header Left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Menu Icon */}
        <AppsIcon sx={{ color: 'primary.main' }}/>
        {/* Trello  */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Trello Icon */}
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main' }}/>
          {/* Trello Text */}
          <Typography sx={{ color: 'primary.main', fontSize: '1.25rem', fontWeight: 'bold' }}>Trello</Typography>
        </Box>
        {/* Workspaces dropdown */}
        <Workspaces />
        {/* Recent dropdown */}
        <Recent />
        {/* Starred dropdown */}
        <Starred />
        {/* Templates dropdown */}
        <Templates />
        {/* Create Button */}
        <Button variant="outlined">Create</Button>
      </Box>

      {/* Header Right */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Input */}
        <TextField id="outlined-search" label="Search..." type="search" size="small" />
        {/* Mode Selector */}
        <SelectMode />
        {/* Notifications Icon */}
        <Tooltip title="Notification">
          <Box sx={{ color: 'action.active' }}>
            <Badge color="secondary" variant="dot">
              <NotificationsNoneIcon sx={{ cursor: 'pointer' }} />
            </Badge>
          </Box>
        </Tooltip>
        {/* Help Icon */}
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
        </Tooltip>
        {/* Avatar */}
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
