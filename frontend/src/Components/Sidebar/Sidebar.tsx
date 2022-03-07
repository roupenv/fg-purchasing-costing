import { Business, Description, DirectionsBoat, LocalOffer, LocalShipping, Payment } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Home from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useLocationHistory from '../../Hooks/useLocationHistory';
import useAuth from '../../Hooks/useAuth';

const sidebarList = [
  {
    linkTo: '/admin',
    name: 'Home',
    Icon: <Home />,
    adminOnly: true,
  },
  {
    linkTo: '/admin/invoices',
    name: 'Invoices',
    Icon: <ReceiptIcon />,
  },
  {
    linkTo: '/admin/shipments',
    name: 'Shipments',
    Icon: <LocalShipping />,
  },
  {
    linkTo: '/admin/products',
    name: 'Products',
    Icon: <LocalOffer />,
  },
  {
    linkTo: '/admin/tarrifs',
    name: 'Tarrifs',
    Icon: <DirectionsBoat />,
  },
  {
    linkTo: '/admin/payments',
    name: 'Payments',
    Icon: <Payment />,
  },
  {
    linkTo: '/admin/vendors',
    name: 'Vendors',
    Icon: <Business />,
  },
  {
    name: 'Reports',
    Icon: <Description />,
    adminOnly: true,
    subItems: [
      {
        linkTo: '/admin/reports/total-costs-over-time',
        name: 'Total Costs Over Time',
        Icon: <Description />,
      },
      {
        linkTo: '/admin/reports/vendor-payment-summary',
        name: 'Vendor Payment Summary',
        Icon: <Description />,
      },
      {
        linkTo: '/admin/reports/avg-unit-cost-per-year',
        name: 'Average Unit Cost Per Year',
        Icon: <Description />,
      },
      {
        linkTo: '/admin/reports/avg-unit-cost-per-product',
        name: 'Average Unit Cost Per Product',
        Icon: <Description />,
      },
    ],
  },
];

const findIndex = (currentResource: string) => {
  for (let i = 0; i < sidebarList.length; i++) {
    if (!('subItems' in sidebarList[i])) {
      if (sidebarList[i].linkTo === '/admin' + currentResource) {
        return i;
      }
    } else {
      for (let j = 0; j < sidebarList[i].subItems!.length; j++) {
        if (sidebarList[i].subItems![j].linkTo === '/admin' + currentResource) {
          return i + (j + 1);
        }
      }
    }
  }
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { user } = useAuth()!;
  const isUser = user?.role === 'USER';

  const handleClick = () => {
    setOpen(!open);
  };

  const { currentResource } = useLocationHistory();

  const sidebarMemo = useMemo(() => findIndex(currentResource), [currentResource]);

  useEffect(() => {
    const sidebarIndexOfCurrentPage = sidebarMemo;
    setSelectedIndex(sidebarIndexOfCurrentPage!);
  }, [sidebarMemo]);

  return (
    <Container disableGutters sx={{ px: '12px' }}>
      <List sx={{ mt: '64px', width: '100%' }} aria-labelledby='nested-list-subheader'>
        {sidebarList.map((item, index) => {
          if (!('subItems' in item)) {
            return (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.linkTo}
                selected={selectedIndex === index}
                disabled={item.adminOnly && isUser}
                // onClick={(event: any) => handleListItemClick(event, index)} //Possibly unneeded because of useEffect and useLocation
                sx={{
                  '&.MuiListItemButton-root:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  '&.Mui-selected': { bgcolor: 'secondary.dark' },
                  '&.Mui-selected:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                <ListItemIcon sx={{ '&.Mui-selected': { color: 'common.black' } }}>{item.Icon}</ListItemIcon>
                <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            );
          } else {
            return (
              <Box key={item.name}>
                <ListItemButton onClick={handleClick} disabled={item.adminOnly && isUser}>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
                  {open ? <ExpandLess color='secondary' /> : <ExpandMore color='secondary' />}
                </ListItemButton>

                <Collapse in={open} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {item.subItems!.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subItem.name}
                        component={Link}
                        to={subItem.linkTo}
                        sx={{
                          pl: 4,
                          '&.MuiListItemButton-root:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                          '&.Mui-selected': { bgcolor: 'secondary.dark' },
                          '&.Mui-selected:hover': { bgcolor: 'secondary.dark' },
                        }}
                        selected={selectedIndex === index + (subIndex + 1)}
                      >
                        <ListItemIcon>{subItem.Icon}</ListItemIcon>
                        <ListItemText primary={subItem.name} primaryTypographyProps={{ variant: 'caption' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }
        })}
      </List>
    </Container>
  );
}
