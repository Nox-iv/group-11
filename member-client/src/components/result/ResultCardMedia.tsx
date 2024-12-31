import { CardMedia, useMediaQuery } from "@mui/material";

import { Box } from "@mui/material";

export interface ResultCardMediaProps {
    imageUrl: string;
    title: string;
}

export default function ResultCardMedia({ imageUrl, title }: ResultCardMediaProps) {    
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ width: isMobile ? '100%' : '25%', maxWidth: '250px', maxHeight: '250px', margin: isMobile ? 'auto' : '0'}}>
            <CardMedia
                component="img"
                height={250}
                width={250}
                image={imageUrl}
                alt={title}
                sx={{ padding: "1em 0 1em", objectFit: "contain", width: '250px', height: '250px'}}
            />
        </Box>
    )
}