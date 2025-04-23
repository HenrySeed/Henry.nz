import { Upload } from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    Stack,
    Tab,
    Tabs,
    TextField,
    TextFieldProps,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getErrorMsg, imageHostingUrl } from "../utilities";
import MarkdownRender from "./MarkdownRender";
import { useKeyPress } from "../hooks/useKeyPress";

export function BlogTextfield(textFieldProps: TextFieldProps) {
    const [isDragging, setDragging] = useState(false);
    const [isUploading, setUploading] = useState(false);
    const theme = useTheme();
    const { user } = useAuth();
    const [preview, setPreview] = useState(false);

    useKeyPress((e) => {
        if (e.key === "Tab") {
            setPreview(!preview);
            e.preventDefault();
        }
    });

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

                const res = await fetch(`${imageHostingUrl}/upload`, {
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
                                `\n![Image](${imageHostingUrl}${versions.full})`,
                        },
                    } as React.ChangeEvent<HTMLInputElement>;
                    textFieldProps.onChange &&
                        textFieldProps.onChange(fakeEvent);
                } else {
                    console.error(res.statusText);
                }
            } catch (err) {
                console.error(
                    `[BlogTextfield] handleDrop Error: ${getErrorMsg(err)}`,
                    err
                );
            }

            setUploading(false);
        }
    }

    return (
        <Stack spacing={3}>
            <Tabs
                value={preview ? "Preview" : "Edit"}
                onChange={(_, newVal) =>
                    setPreview(newVal === "Preview" ? true : false)
                }
                aria-label="basic tabs example"
            >
                <Tab
                    disabled={textFieldProps.disabled}
                    value="Edit"
                    label="Edit"
                />
                <Tab
                    disabled={textFieldProps.disabled}
                    value="Preview"
                    label="Preview"
                />
            </Tabs>
            {!preview && (
                <Box
                    sx={{
                        display: "grid",
                        position: "relative",
                        ...textFieldProps.sx,
                    }}
                >
                    {isDragging && (
                        <Stack
                            spacing={1}
                            sx={{
                                position: "absolute",
                                inset: 0,
                            }}
                            justifyContent="center"
                            alignItems={"center"}
                        >
                            <Typography
                                sx={{ fontSize: "18pt" }}
                                color="primary"
                            >
                                <Upload /> Upload Image
                            </Typography>
                        </Stack>
                    )}
                    {isUploading && (
                        <Stack
                            spacing={1}
                            sx={{
                                position: "absolute",
                                inset: 0,
                            }}
                            justifyContent="center"
                            alignItems={"center"}
                        >
                            <CircularProgress size={30} />
                            <Typography
                                sx={{
                                    fontSize: "18pt",
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
            )}
            {preview && (
                <div style={{ minHeight: "125px" }}>
                    <MarkdownRender>
                        {textFieldProps.value as string}
                    </MarkdownRender>
                </div>
            )}
        </Stack>
    );
}
