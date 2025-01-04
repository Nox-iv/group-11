import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, useMediaQuery } from '@mui/material';

import { ResultCardMediaProps } from './ResultCardMedia';
import { ResultCardTitleProps } from './ResultCardTitle';
import { ResultCardFieldProps } from './ResultCardField';

import ResultCardMedia from './ResultCardMedia';
import ResultCardTitle from './ResultCardTitle';
import ResultCardField from './ResultCardField';

export interface ResultCardProps {
    key: string;
    resultCardMedia: ResultCardMediaProps;
    resultCardTitle: ResultCardTitleProps;
    resultCardFields: ResultCardFieldProps[];
    disabled?: boolean;
    onClick?: (key: string) => void;
}

export default function ResultCard({ key, resultCardMedia, resultCardTitle, resultCardFields, disabled = false, onClick }: ResultCardProps) {

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea 
        disabled={disabled}
        onClick={() => onClick?.(key)}
        sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row'}}>
        <Box sx={{ 
            flexShrink: 0,  // Prevent the media box from shrinking
            width: isMobile ? '100%' : '250px',
            maxHeight: '250px'
        }}>
            <ResultCardMedia {...resultCardMedia} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardContent sx={{ 
                textAlign: 'left',
                padding: 2,
                '&:last-child': { paddingBottom: 2 }
            }}>
                <ResultCardTitle title={resultCardTitle.title} />
                {resultCardFields.map((field, index) => (
                    <ResultCardField key={index} label={field.label} value={field.value} hidden={field.hidden} />
                ))}
            </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}