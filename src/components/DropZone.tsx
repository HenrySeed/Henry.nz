import { Box, CircularProgress, Stack, SxProps, useTheme } from "@mui/material";
import { ReactElement, useCallback, useState } from "react";
import icon from "react-syntax-highlighter/dist/esm/languages/prism/icon";

export function DragDropFileUpload({
    onFileUpload,
    sx,
    children,
}: {
    onFileUpload: (file: File) => any;
    sx?: SxProps;
    children: ReactElement;
}) {
    const [dragOver, setDragOver] = useState(false);
    const theme = useTheme();

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragOver(true);
        },
        []
    );

    const handleDragLeave = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragOver(false);
        },
        []
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragOver(false);
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
                onFileUpload(event.dataTransfer.files[0]);
            }
        },
        [onFileUpload]
    );

    const handleChange = useCallback(
        (event: any) => {
            if (event.target.files && event.target.files[0]) {
                onFileUpload(event.target.files[0]);
            }
        },
        [onFileUpload]
    );

    return (
        <Box
            sx={{
                height: "100px",
                width: "100%",
                border: `1px solid `,
                borderColor: dragOver
                    ? theme.palette.primary.main
                    : "rgba(255,255,255,0.23)",
                color: dragOver
                    ? theme.palette.primary.main
                    : "rgba(255,255,255,0.6)",
                borderRadius: "4px",
                cursor: "pointer",
                ...sx,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onMouseLeave={() => setDragOver(false)}
        >
            <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleChange}
            />
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ height: "100%" }}
            >
                {children}
            </Stack>
        </Box>
    );
}
