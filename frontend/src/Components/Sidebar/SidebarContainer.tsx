import { Drawer } from '@mui/material';
import { Box } from '@mui/system';
import Sidebar from './Sidebar';

export default function SideBarContainer({ drawerWidth, mobileOpen, handleDrawerToggle, container }: any) {
  return (
    <Box
      component='nav'
      sx={{
        width: { lg: drawerWidth },
        flexShrink: { sm: 0 },
        display: 'inline',
        displayPrint: 'none',
      }}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          ml: '20px',
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'primary.main',
            borderRadius: '0',
            borderTopRightRadius: '20px',
            mt: '75px',
          },
        }}
      >
        <Sidebar />
      </Drawer>
      <Drawer
        variant='permanent'
        sx={{
          ml: '20px',
          display: { xs: 'none', lg: 'inline' },
          '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: 'primary.main', borderRadius: '0' },
        }}
        open
      >
        <Sidebar />
      </Drawer>
    </Box>
  );
}
