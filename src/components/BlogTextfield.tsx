import { Upload } from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    Stack,
    TextField,
    TextFieldProps,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function BlogTextfield(textFieldProps: TextFieldProps) {
    const [isDragging, setDragging] = useState(false);
    const [isUploading, setUploading] = useState(false);
    const theme = useTheme();
    const { user } = useAuth();

    async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            console.log("[Blog] Uploading image", file);
            setUploading(true);
            try {
                const form = new FormData();
                form.append("image", file);

                const idToken = user && (await user.getIdToken());

                const res = await fetch("http://localhost:3001/upload", {
                    method: "POST",
                    body: form,
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                if (res.status === 200) {
                    const versions = await res.json();
                    console.log(`[Blog] Upload complete:`, versions);

                    const fakeEvent = {
                        target: {
                            value:
                                textFieldProps.value +
                                `\n![Image](http://localhost:3001${versions.full})`,
                        },
                    } as React.ChangeEvent<HTMLInputElement>;
                    textFieldProps.onChange &&
                        textFieldProps.onChange(fakeEvent);
                } else {
                    console.error(res.statusText);
                }
            } catch (err) {
                console.error(e);
            }

            setUploading(false);
        }
    }

    return (
        <Box
            sx={{
                display: "grid",
                position: "relative",
                ...textFieldProps.sx,
            }}
        >
            {isDragging && (
                <Typography
                    sx={{
                        position: "absolute",
                        inset: 0,
                        top: "110px",
                        textAlign: "center",
                        fontSize: "20pt",
                    }}
                    color="primary"
                >
                    <Upload /> Upload Image
                </Typography>
            )}
            {isUploading && (
                <Stack
                    spacing={2}
                    sx={{
                        position: "absolute",
                        inset: 0,
                        top: "80px",
                    }}
                    alignItems={"center"}
                >
                    <CircularProgress />
                    <Typography
                        sx={{
                            fontSize: "20pt",
                        }}
                        color="primary"
                    >
                        Uploading
                    </Typography>
                </Stack>
            )}
            <TextField
                {...textFieldProps}
                disabled={textFieldProps.disabled || isUploading}
                sx={{
                    ...(isDragging && {
                        "& fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                        "& textarea, & input": {
                            color: theme.palette.action.disabled,
                        },
                    }),
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            />
        </Box>
    );
}
