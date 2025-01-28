import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
const sx ={
  borderRadius: '4px',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  color: 'white',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}
const BoardBar = () => {
  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      display: 'flex',
      alignItems: 'center',
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      px: 2,
      borderBottom: '1px solid white',
      overflowX: 'auto',
      gap: 2,
      justifyContent:'space-between'
    }}>
      {/* Left nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Chip ThanhPhatDev Stack Board */}
        <Chip
          sx={sx}
          icon={<SpaceDashboardIcon />}
          label="ThanhPhatDev Stack Board"
          clickable
        />
        {/* Chip Public/Private Workspace*/}
        <Chip
          sx={sx}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        {/* Chip Collaborate with team*/}
        <Chip
          sx={sx}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        {/* Chip Automation */}
        <Chip
          sx={sx}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        {/* Chip Filters */}
        <Chip
          sx={sx}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      {/* Right nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Button invite */}
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
        {/* People in team */}
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
        >
          <Tooltip title="Phat's family">
            <Avatar alt="Phat's family" src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/473328308_1327000315122575_4157714033055204981_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HxCFqDU88XMQ7kNvgFXLPK8&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ArIM2rf1ogcyxBT_aYeMvwZ&oh=00_AYCqDOHSDajTMhrlK-Nuzc5FCGRN2dVIM5XVmXuI5SOB9A&oe=679E7B1B" />
          </Tooltip>
          <Tooltip title="Phat's family2">
            <Avatar alt="Phat's family2" src="https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/149655037_460108191811796_2205221393854080260_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=CHBn0aR_TakQ7kNvgGo8qzy&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AsjNb7G2_mj5jtwotfy_HF5&oh=00_AYAECjlnv2aFQL46fEGVAX3qLkILRw7Ex_ltPyV5Y5FIeg&oe=67C00B89" />
          </Tooltip>
          <Tooltip title="Waterfall">
            <Avatar alt="Waterfall" src="https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/447673316_420543157467716_4793215870179751841_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=yaK4wz1o9JYQ7kNvgEEvebr&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=AfAm2J1_45aJnkObBShq5mJ&oh=00_AYAW4KiXJxE1P9zvHDQjHtah1Z7mChvf3vgchSPL78YTTw&oe=679E5882" />
          </Tooltip>
          <Tooltip title="fullstack">
            <Avatar alt="fullstack" src="https://almablog-media.s3.ap-south-1.amazonaws.com/MERN_Stack_9437df2ba9_62af1dd3fc.png" />
          </Tooltip>
          <Tooltip title="Trevor Henderson">
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
