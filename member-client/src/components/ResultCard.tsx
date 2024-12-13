import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';
import { MediaSearchResult } from '../api/types/mediaSearchResult';

export default function ResultCard({ media }: { media: MediaSearchResult }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ width: '25%', maxWidth: '250px', maxHeight: '250px'}}>
            <CardMedia
                component="img"
                height={250}
                width={250}
                image={media.imageUrl}
                alt={media.title}
                sx={{ padding: "1em 0 1em", objectFit: "contain", width: '250px', height: '250px'}}
            />
        </Box>
        <CardContent sx={{ flex: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {media.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>Type: </Typography>
            {media.type}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>Publisher: </Typography>
            {media.author}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>Release Date: </Typography>
            {new Date(media.releaseDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>Genres: </Typography>
            {media.genres.join(', ')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>Description: </Typography>
            {media.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}