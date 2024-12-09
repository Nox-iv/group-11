import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionCard({
  imgSrc,
  title, 
  description,
  height = 300,
  width = 300,
}: {
  imgSrc: string;
  title: string;
  description: string;
  height?: number;
  width?: number;
}) {
  return (
    <Card sx={{ margin: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={height}
          width={width}
          image={imgSrc}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}