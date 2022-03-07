import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import useAuth from '../../Hooks/useAuth';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Alert from '@mui/material/Alert';

function stringAvatar(name: string) {
  return { children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` };
}

interface IAppBarContainer {
  handleDrawerToggle: React.MouseEventHandler<HTMLButtonElement>
  drawerWidth: string | number
}


export default function AppBarContainer({ handleDrawerToggle, drawerWidth }: IAppBarContainer) {
  const auth = useAuth();
  const user = auth?.user?.firstName + ' ' + auth?.user?.lastName;
  const userId = String(auth?.user?.id);
  const handleOnLogout = auth?.logout;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        borderRadius: '0',
        width: { lg: `calc(100% - ${String(drawerWidth)}px)` },
        ml: { md: `${drawerWidth}px` },
        // width: { sm: '100%' },
        zIndex: '3000',
        displayPrint: 'none',
      }}
    >
      {process.env.REACT_APP_MODE === 'demo' && <Alert severity='info'>This is a demo environment!</Alert>}
      <Toolbar sx={{ justifyContent: { xs: 'space-between', lg: 'flex-end' } }}>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Button onClick={handleClick}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Avatar
              {...stringAvatar(user.toUpperCase())}
              sx={{
                textDecorationLine: 'none',
                bgcolor: 'primary.main',
                ':hover': {
                  boxShadow: 6,
                },
              }}
            />
            <Typography variant='body2'>{user}</Typography>
          </Stack>
        </Button>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            '& .MuiMenu-paper': { bgcolor: 'primary.main', width: '175px' },
            '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <MenuItem component={Link} to={`/admin/accounts/${userId}`}>
            <ListItemIcon>
              <AccountCircleIcon color='secondary' />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOnLogout}>
            <ListItemIcon>
              <LogoutIcon color='error' />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
