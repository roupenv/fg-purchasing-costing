import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DashboardSummaryComparisonCard, { IDashboardSummaryComparisonCard } from './DashboardSummaryComparisonCard';
import DashboardSummaryStandardCard, { IDashboardSummaryStandardCard } from './DashboardSummaryStandardCard';

interface IDashboardSummaryBar {
  cards: (IDashboardSummaryComparisonCard | IDashboardSummaryStandardCard)[];
}

export default function DashboardSummaryBar({ cards }: IDashboardSummaryBar) {
  return (
    <Paper elevation={6} sx={{ p: '16px', height: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 6 }}
        justifyContent='space-evenly'
        divider={<Divider orientation='vertical' flexItem />}
      >
        {cards.map((card) => {
          if ('currentMetric' in card) {
            return (
              <DashboardSummaryComparisonCard
                key={card.cardTitle}
                cardTitle={card.cardTitle}
                currentMetric={card.currentMetric}
                previousMetric={card.previousMetric}
                type={card.type}
              />
            );
          } else {
            return (
              <DashboardSummaryStandardCard
                key={card.cardTitle}
                cardTitle={card.cardTitle}
                metric={card.metric}
                subtitle={card.subtitle}
              />
            );
          }
        })}
      </Stack>
    </Paper>
  );
}
