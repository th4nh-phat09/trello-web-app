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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
const AppBar = () => {
  const [searchText, setSearchText] = useState('')
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      px: 2,
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      {/* Header Left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Menu Icon */}
        <AppsIcon sx={{ color: 'white' }}/>
        {/* Trello  */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Trello Icon */}
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'white', fontSize: 'large' }}/>
          {/* Trello Text */}
          <Typography sx={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Trello</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {/* Workspaces dropdown */}
          <Workspaces />
          {/* Recent dropdown */}
          <Recent />
          {/* Starred dropdown */}
          <Starred />
          {/* Templates dropdown */}
          <Templates />
          {/* Create Button */}
          <Button
            variant="outlined"
            startIcon={<LibraryAddIcon />}
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Header Right */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Input */}
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                sx={{ color: searchText ? 'white' : 'transparent', fontSize: 'small', cursor: 'pointer' }}
                onClick={() => setSearchText('')}
              />
            )
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}/>
        {/* Mode Selector */}
        <SelectMode />
        {/* Notifications Icon */}
        <Tooltip title="Notification">
          <Box sx={{ color: 'action.active' }}>
            <Badge color="secondary" variant="dot">
              <NotificationsNoneIcon sx={{ cursor: 'pointer', color: 'white' }} />
            </Badge>
          </Box>
        </Tooltip>
        {/* Help Icon */}
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        {/* Avatar */}
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
