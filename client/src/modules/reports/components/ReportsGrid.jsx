import { Grid } from '@mui/material';
import ReportCard from './ReportCard';

const ReportsGrid = ({ cards }) => {
  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ReportCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportsGrid;
