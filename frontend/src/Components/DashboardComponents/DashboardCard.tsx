import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ResponsiveContainer } from 'recharts';
import Skeleton from '@mui/material/Skeleton';

interface IDashboardCard {
  cardTitle: string;
  children: React.ReactElement;
  loading: boolean;
}

export default function DashboardCard({ cardTitle, children, loading }: IDashboardCard) {
  return (
    <Paper sx={{ p: '16px', height: { xs: '250px', sm: '400px' } }} elevation={6}>
      <Typography variant='h6'>{cardTitle}</Typography>
      <Box sx={{ width: 1, height: { xs: '200px', md: '350px' } }}>
        <ResponsiveContainer height='100%' width='100%'>
          {loading ? <Skeleton variant='text' width={210} height={118} /> : children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
