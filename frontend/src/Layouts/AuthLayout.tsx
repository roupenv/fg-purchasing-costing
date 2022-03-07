import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useState } from 'react';
import AppBarContainer from '../Components/AppBar/AppBarContainer';
import SideBarContainer from '../Components/Sidebar/SidebarContainer';

const drawerWidth = 230;

interface IAuthLayout {
  children: JSX.Element | JSX.Element[];
  window?: any;
}

export default function AuthLayout({ children, window }: IAuthLayout) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className='Admin' sx={{ display: 'flex' }}>
      {/* Left Sidebar*/}
      <SideBarContainer
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        container={container}
      />

      {/* Top Bar Dynamically changes with Page Width */}
      <AppBarContainer handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

      {/* Main Content Area */}
      <Container
        component='main'
        maxWidth='xl'
        sx={{
          display: 'inline',
          marginTop: process.env.REACT_APP_MODE === 'demo' ? '120px' : '64px',
          flexGrow: 1,
          px: {xs: 0.5, sm: 3},
          py: 3,
          width: { xs: `calc(100% - ${drawerWidth}px)` },
          '@media print': {
            marginTop: '0',
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
