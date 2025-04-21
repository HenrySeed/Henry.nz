import { setDoc, doc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { db } from "../../components/firebase";
import {
    Box,
    Button,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import MarkdownRender from "../../components/MarkdownRender";
import { ArrowBackIos, Delete, Edit, PushPin, Save } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { CenteredProgress } from "../../components/Loading";
import { TimeStamp } from "../../components/TimeStamp";
import { useBlogPost } from "../../hooks/useBlogPost";
import { BlogPost, TimelineItem } from "../../types";

export function BlogPostView() {
    const { id } = useParams();
    const [editMode, setEditMode] = useState(id === "new");
    const { blogPost, loading, refetch } = useBlogPost(id);
    const navigate = useNavigate();
    useAuth();

    if (!editMode) {
        return (
            <div className="projWrapper">
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        onClick={() => navigate("/blog")}
                        startIcon={<ArrowBackIos />}
                    >
                        All Posts
                    </Button>
                    {!editMode && (
                        <Button
                            startIcon={<Edit />}
                            onClick={() => {
                                setEditMode(true);
                                refetch();
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </Stack>

                {loading && <CenteredProgress />}

                {!loading && blogPost && blogPost.type === "Text Post" && (
                    <TextPostView blogPost={blogPost} />
                )}
                {!loading && blogPost && blogPost.type === "Timeline Post" && (
                    <TimeLinePostView
                        blogPost={blogPost}
                        onPost={() => refetch()}
                    />
                )}
            </div>
        );
    } else {
        return (
            <div className="projWrapper">
                <BlogPostEditView
                    post={blogPost}
                    onExitEditing={() => {
                        setEditMode(false);
                        refetch();
                    }}
                />
            </div>
        );
    }
}

function TimeLinePostView({
    blogPost,
    onPost,
}: {
    blogPost: BlogPost;
    onPost: () => void;
}) {
    // we parse the content into a json array of TimelineItem
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [newItem, setNewItem] = useState("");
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        setItems(JSON.parse(blogPost.content));
    }, [blogPost]);

    async function handleSave() {
        const newContents: TimelineItem[] = [
            ...items,
            { createdMs: Date.now(), text: newItem },
        ];
        newContents.sort((a, b) => b.createdMs - a.createdMs);
        const newPost = {
            ...blogPost,
            content: JSON.stringify(newContents),
            updated: Date.now(),
            created: blogPost.updated.getTime(),
        };
        console.log("[blog] Saving Timeline BlogPost", blogPost.id, newPost);

        setSaving(true);
        await setDoc(doc(db, "blogPosts", blogPost.id), newPost).catch((e) =>
            console.error(e)
        );

        setNewItem("");
        setPreview(false);
        onPost();
        setSaving(false);
    }

    return (
        <>
            <h1 style={{ marginBottom: "40px" }}>{blogPost.title}</h1>
            <Stack spacing={3}>
                <Stack spacing={2}>
                    {!preview ? (
                        <TextField
                            disabled={saving}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && !e.shiftKey && handleSave()
                            }
                            autoFocus
                            label="New Post"
                            rows={4}
                            multiline
                            value={newItem}
                        />
                    ) : (
                        <MarkdownRender>{newItem}</MarkdownRender>
                    )}
                    <Stack
                        direction="row"
                        justifyContent={
                            newItem.length > 0 ? "space-between" : "flex-end"
                        }
                        spacing={2}
                    >
                        {newItem.length > 0 && (
                            <Button onClick={() => setPreview(!preview)}>
                                {!preview ? "Preview" : "Edit"}
                            </Button>
                        )}
                        <Button
                            // Disabled when the new item is only whitespace
                            disabled={
                                saving ||
                                newItem.replace(/\s/g, "").length === 0
                            }
                            onClick={() => handleSave()}
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        sx={{
                                            width: "20px !important",
                                            height: "20px !important",
                                        }}
                                    />
                                ) : (
                                    <PushPin />
                                )
                            }
                        >
                            Post
                        </Button>
                    </Stack>
                </Stack>

                {items.map((item) => (
                    <CardContent key={item.createdMs}>
                        <TimeStamp date={new Date(item.createdMs)} />
                        <MarkdownRender>{item.text}</MarkdownRender>
                    </CardContent>
                ))}
                {items.length === 0 && (
                    <Typography
                        sx={{
                            opacity: 0.8,
                            textAlign: "center",
                            paddingTop: "40px",
                        }}
                    >
                        There are no posts yet
                    </Typography>
                )}
            </Stack>
        </>
    );
}
function TextPostView({ blogPost }: { blogPost: BlogPost }) {
    return (
        <Box sx={{ marginTop: "30px" }}>
            <TimeStamp date={blogPost.updated} />
            <MarkdownRender>
                {`# ${blogPost.title}\n` + blogPost.content}
            </MarkdownRender>
        </Box>
    );
}

function BlogPostEditView({
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
                                <TextField
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
                        onClick={async () => {
                            setDeleting(true);
                            await setDoc(doc(db, "blogPosts", id), {
                                ...post,
                                deleted: true,
                            }).catch((e) => console.error(e));
                            setDeleting(false);

                            navigate(`/blog/`, { replace: true });
                            onExitEditing();
                        }}
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
                            onClick={async () => {
                                const now = Date.now();
                                const newPost = {
                                    id,
                                    title,
                                    content,
                                    type,
                                    created: post?.created ?? now,
                                    updated: now,
                                    tags: tags,
                                };
                                console.log(
                                    "[blog] Saving BlogPost",
                                    id,
                                    newPost
                                );

                                setSaving(true);
                                await setDoc(
                                    doc(db, "blogPosts", id),
                                    newPost
                                ).catch((e) => console.error(e));
                                setSaving(false);

                                navigate(`/blog/${id}`, { replace: true });
                                onExitEditing();
                            }}
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
