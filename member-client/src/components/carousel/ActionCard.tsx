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
  onClick,
}: {
  imgSrc: string;
  title: string;
  description: string;
  height?: number;
  width?: number;
  onClick?: () => void;
}) {
  return (
    <Card sx={{ margin: 2 }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height={height}
          width={width}
          image={imgSrc}
          alt="media image"
          sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
        />
        <CardContent sx={{ height: 120 }}>
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