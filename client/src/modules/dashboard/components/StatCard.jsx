import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => {
  const isPositive = trend === 'up';
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Box sx={{ color: color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1, color: color }}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {trendValue && (
          <Chip
            icon={isPositive ? <TrendingUp /> : <TrendingDown />}
            label={`${isPositive ? '+' : ''}${trendValue}%`}
            size="small"
            sx={{
              bgcolor: isPositive ? 'success.light' : 'error.light',
              color: isPositive ? 'success.dark' : 'error.dark',
              fontWeight: 600,
              height: 24,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
