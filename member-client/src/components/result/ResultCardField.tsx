import { Typography } from "@mui/material";

export interface ResultCardFieldProps {
    label: string;
    value: string;
    hidden?: boolean;
}

export default function ResultCardField({ label, value, hidden = false }: ResultCardFieldProps) {
    return (
        <Typography variant="body1" sx={{ color: 'text.secondary', display: hidden ? 'none' : 'block' }}>
            <Typography component="span" sx={{ color: 'text.primary' }}>{label}: </Typography>
            {value}
        </Typography>
    )
}