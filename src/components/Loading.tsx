import { CircularProgress, SxProps } from "@mui/material";

export function CenteredProgress({ sx }: { sx?: SxProps }) {
    return (
        <span>
            <CircularProgress
                sx={{
                    color: "white",
                    display: "block",
                    marginX: "auto",
                    marginTop: "30vh",
                    ...sx,
                }}
            />
        </span>
    );
}
