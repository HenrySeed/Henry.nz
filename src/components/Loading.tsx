import { CircularProgress, Stack } from "@mui/material";

export function CenteredCircular() {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            style={{ height: "100%", width: "100%" }}
        >
            <CircularProgress sx={{ color: "white" }} />
        </Stack>
    );
}
