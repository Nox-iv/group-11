import { Typography } from "@mui/material";

export interface ResultCardTitleProps {
    title: string;
}

export default function ResultCardTitle({ title }: ResultCardTitleProps) {
    return (
        <Typography gutterBottom variant="h5" component="div">
            {title}
        </Typography>
    )
}