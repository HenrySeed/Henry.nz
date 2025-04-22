import { Save, Delete } from "@mui/icons-material";
import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Button,
    CircularProgress,
} from "@mui/material";
import { setDoc, doc } from "firebase/firestore/lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../components/firebase";
import MarkdownRender from "../../components/MarkdownRender";
import { useAuth } from "../../hooks/useAuth";
import { BlogPost } from "../../types";
import { BlogTextfield } from "../../components/BlogTextfield";

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

    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    useAuth();

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags);
            setType(post.type);
            setID(post.id);
        }
    }, [post]);

    useEffect(() => {
        if (type === "Timeline Post") {
            setContent("[]");
        }
    }, [type]);

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
        };
        console.log("[blog] Saving BlogPost", id, newPost);

        setSaving(true);
        await setDoc(doc(db, "blogPosts", id), newPost).catch((e) =>
            console.error(e)
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
        }).catch((e) => console.error(e));
        setDeleting(false);

        navigate(`/blog/`, { replace: true });
        onExitEditing();
    }

    return (
        <>
            <Stack spacing={4}>
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
                    <>
                        <Tabs
                            value={preview ? "Preview" : "Edit"}
                            onChange={(_, newVal) =>
                                setPreview(newVal === "Preview" ? true : false)
                            }
                            aria-label="basic tabs example"
                        >
                            <Tab disabled={saving} value="Edit" label="Edit" />
                            <Tab
                                disabled={saving}
                                value="Preview"
                                label="Preview"
                            />
                        </Tabs>
                        {!preview && (
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
                        {preview && (
                            <div style={{ minHeight: "250px" }}>
                                <MarkdownRender>{content}</MarkdownRender>
                            </div>
                        )}
                    </>
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
                                <Save />
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
                            startIcon={<Delete />}
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
