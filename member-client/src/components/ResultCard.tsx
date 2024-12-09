import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';

export default function ResultCard() {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ width: '25%'}}>
            <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                alt="green iguana"
        />
        </Box>
        <CardContent sx={{ flex: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            Static Title
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Static Description
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}