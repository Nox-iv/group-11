import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, useMediaQuery } from '@mui/material';

import { MediaDocument } from '../api/media-search/types/mediaSearchResult';

export default function ResultCard({ media, onClick }: { media: MediaDocument, onClick?: (key: string) => void}) {
  const isSmallerDevice = useMediaQuery('(max-width:1150px)');

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea 
        onClick={() => onClick?.(media.mediaId.toString())}
        sx={{ display: 'flex', flexDirection: isSmallerDevice ? 'column' : 'row' }}>
        <Box sx={{ width: isSmallerDevice ? '100%' : '25%', maxWidth: '250px', maxHeight: '250px'}}>
            <CardMedia
                component="img"
                height={250}
                width={250}
                image={media.imageUrl}
                alt={media.title}
                sx={{ padding: "1em 0 1em", objectFit: "contain", width: '250px', height: '250px'}}
            />
        </Box>
        <CardContent sx={{ flex: 1, width: '75%', textAlign: 'left' }}>
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
          {!isSmallerDevice && 
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              <Typography component="span" sx={{ color: 'text.primary' }}>Description: </Typography>
              {media.description}
            </Typography>
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
}