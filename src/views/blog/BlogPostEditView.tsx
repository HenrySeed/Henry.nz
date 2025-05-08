import { Save, Delete, Upload, Cancel } from "@mui/icons-material";
import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import { setDoc, doc } from "firebase/firestore/lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../components/firebase";
import { BlogPost } from "../../types";
import { BlogTextfield } from "../../components/BlogTextfield";
import { DragDropFileUpload } from "../../components/DropZone";
import { getErrorMsg, imageHostingUrl } from "../../utilities";
import { BlogCover } from "../../components/BlogCover";
import { useAuthContext } from "../../hooks/AuthContext";

export function BlogPostEditView({
    post,
    onExitEditing,
}: {
    post: BlogPost | null;
    onExitEditing: () => void;
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [id, setID] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [type, setType] = useState<"Text Post" | "Timeline Post">(
        "Text Post"
    );
    const [cover, setCover] = useState("");

    const [coverUploading, setCoverUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags);
            setType(post.type);
            setID(post.id);
            setCover(post.cover);
        }
    }, [post]);

    useEffect(() => {
        if (post === null && type === "Timeline Post") {
            setContent("[]");
        }
    }, [id, type, post]);

    useEffect(() => {
        // if we have no post, update the id with the new title based one
        if (!post) {
            setID(
                title
                    .toLowerCase()
                    .replace(/[^a-z ]/g, "")
                    .replace(/ {2}/g, " ")
                    .replace(/ /g, "-")
            );
        }
    }, [title, post]);

    async function handleSave() {
        const now = Date.now();
        const newPost = {
            id,
            title,
            content,
            type,
            created: post?.created.getTime() ?? now,
            updated: now,
            tags: tags,
            cover,
        };
        console.log("[blog] Saving BlogPost", id, newPost);

        setSaving(true);
        await setDoc(doc(db, "blogPosts", id), newPost).catch((err) =>
            console.error(
                `[BlogPostEditView] handleSave Error: ${getErrorMsg(err)}`,
                err
            )
        );
        setSaving(false);

        navigate(`/blog/${id}`, { replace: true });
        onExitEditing();
    }

    async function handleDelete() {
        setDeleting(true);
        await setDoc(doc(db, "blogPosts", id), {
            ...post,
            deleted: true,
        }).catch((err) =>
            console.error(
                `[BlogPostEditView] handleDelete Error: ${getErrorMsg(err)}`,
                err
            )
        );
        setDeleting(false);

        navigate(`/blog/`, { replace: true });
        onExitEditing();
    }

    return (
        <>
            <Stack spacing={4}>
                {cover ? (
                    <Stack spacing={1} alignItems="flex-end">
                        <BlogCover src={cover} />
                        <Button
                            sx={{ width: "fit-content" }}
                            variant="outlined"
                            onClick={() => setCover("")}
                        >
                            Remove Cover
                        </Button>
                    </Stack>
                ) : (
                    <DragDropFileUpload
                        onFileUpload={async (file) => {
                            console.log("[Blog] Uploading image", file);
                            setCoverUploading(true);
                            try {
                                const form = new FormData();
                                form.append("image", file);

                                const idToken =
                                    user && (await user.getIdToken());

                                const res = await fetch(
                                    `${imageHostingUrl}/upload`,
                                    {
                                        method: "POST",
                                        body: form,
                                        headers: {
                                            Authorization: `Bearer ${idToken}`,
                                        },
                                    }
                                );
                                if (res.status === 200) {
                                    const { full } = await res.json();
                                    console.log(
                                        `[Blog] Upload complete:`,
                                        full
                                    );
                                    setCover(full);
                                } else {
                                    console.error(res.statusText);
                                }
                            } catch (err) {
                                console.error(
                                    `[BlogPostEditView] onFileUpload Error: ${getErrorMsg(
                                        err
                                    )}`,
                                    err
                                );
                            }

                            setCoverUploading(false);
                        }}
                    >
                        <Stack spacing={1} direction="row" alignItems="center">
                            {coverUploading ? (
                                <>
                                    <CircularProgress size={20} />
                                    <span>Uploading</span>
                                </>
                            ) : (
                                <>
                                    <Upload />
                                    <span>Upload Cover Photo</span>
                                </>
                            )}
                        </Stack>
                    </DragDropFileUpload>
                )}
                <TextField
                    autoFocus
                    disabled={saving}
                    variant="outlined"
                    label="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                {/* Only show the type selector for new posts */}
                {post === null && (
                    <FormControl>
                        <InputLabel id="post-type-label">Post Type</InputLabel>
                        <Select
                            labelId="post-type-label"
                            label="Post Type"
                            sx={{ width: "160px" }}
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                        >
                            <MenuItem value={"Text Post"}>Text Post</MenuItem>
                            <MenuItem value={"Timeline Post"}>
                                Timeline Post
                            </MenuItem>
                        </Select>
                    </FormControl>
                )}
                {type === "Text Post" && (
                    <Stack spacing={2}>
                        <BlogTextfield
                            disabled={saving}
                            maxRows={20}
                            multiline
                            minRows={10}
                            variant="outlined"
                            label="Content"
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                        {/* TODO: tags */}
                    </Stack>
                )}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Button
                        variant="outlined"
                        color="error"
                        disabled={saving || id === ""}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    sx={{
                                        color: "#aaa",
                                        width: "20px !important",
                                        height: "20px !important",
                                    }}
                                />
                            ) : (
                                <Delete />
                            )
                        }
                        onClick={async () => handleDelete()}
                    >
                        Delete
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            disabled={saving || id === ""}
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        sx={{
                                            color: "#aaa",
                                            width: "20px !important",
                                            height: "20px !important",
                                        }}
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            onClick={async () => handleSave()}
                        >
                            Save
                        </Button>
                        <Button
                            disabled={saving}
                            startIcon={<Cancel />}
                            variant="outlined"
                            onClick={() => {
                                navigate(`/blog/${id}`, { replace: true });
                                onExitEditing();
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}
