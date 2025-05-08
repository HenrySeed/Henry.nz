import { setDoc, doc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { db } from "../../components/firebase";
import { Box, Button, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import MarkdownRender from "../../components/MarkdownRender";
import { ArrowBackIos, Cancel, Edit, PushPin, Save } from "@mui/icons-material";
import { CenteredProgress } from "../../components/Loading";
import { TimeStamp } from "../../components/TimeStamp";
import { useBlogPost } from "../../hooks/useBlogPost";
import { BlogPost, TimelineItem } from "../../types";
import { BlogPostEditView } from "./BlogPostEditView";
import { BlogTextfield } from "../../components/BlogTextfield";
import { BlogCover } from "../../components/BlogCover";
import { getErrorMsg } from "../../utilities";
import { ProgressButton } from "../../components/ProgressButton";
import { useAuthContext } from "../../hooks/AuthContext";

export function BlogPostView() {
    const { id } = useParams();
    const [editMode, setEditMode] = useState(id === "new");
    const { blogPost, loading, refetch } = useBlogPost(id);
    const navigate = useNavigate();
    const { role } = useAuthContext();

    if (!editMode) {
        return (
            <div className="projWrapper" style={{ overflowX: "visible" }}>
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        onClick={() => navigate("/blog")}
                        startIcon={<ArrowBackIos />}
                    >
                        All Posts
                    </Button>

                    {!editMode && role === "admin" && (
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

                {!loading && blogPost && (
                    <>
                        {blogPost.cover && (
                            <BlogCover
                                sx={{ marginTop: "20px" }}
                                src={blogPost.cover}
                            />
                        )}
                    </>
                )}

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
            <div className="projWrapper" style={{ overflowX: "visible" }}>
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
    const [isSaving, setIsSaving] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const { role } = useAuthContext();

    useEffect(() => {
        setItems(JSON.parse(blogPost.content));
    }, [blogPost]);

    async function handleSave(newItems: TimelineItem[]) {
        newItems.sort((a, b) => b.createdMs - a.createdMs);
        const newPost = {
            ...blogPost,
            content: JSON.stringify(newItems),
            updated: Date.now(),
            created: blogPost.updated.getTime(),
        };
        console.log("[blog] Saving Timeline BlogPost", blogPost.id, newPost);

        setIsSaving(true);
        await setDoc(doc(db, "blogPosts", blogPost.id), newPost).catch((err) =>
            console.error(
                `[TimeLinePostView] handleSave Error ${getErrorMsg(err)}`,
                err
            )
        );

        setNewItem("");
        onPost();
        setIsSaving(false);
    }

    return (
        <>
            <h1 style={{ marginBottom: "40px" }}>{blogPost.title}</h1>
            <Stack spacing={3}>
                {role === "admin" && (
                    <Stack spacing={2}>
                        <BlogTextfield
                            disabled={editingIndex >= 0 || isSaving}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    handleSave([
                                        ...items,
                                        {
                                            createdMs: Date.now(),
                                            text: newItem,
                                        },
                                    ]);
                                }
                            }}
                            autoFocus
                            label="New Post"
                            rows={4}
                            multiline
                            value={newItem}
                        />

                        <Stack
                            direction="row"
                            justifyContent={"flex-end"}
                            spacing={2}
                        >
                            <ProgressButton
                                // Disabled when the new item is only whitespace
                                disabled={
                                    isSaving ||
                                    newItem.replace(/\s/g, "").length === 0
                                }
                                onClick={() =>
                                    handleSave([
                                        ...items,
                                        {
                                            createdMs: Date.now(),
                                            text: newItem,
                                        },
                                    ])
                                }
                                showProgress={editingIndex === -1 && isSaving}
                                variant="contained"
                                startIcon={<PushPin />}
                            >
                                Post
                            </ProgressButton>
                        </Stack>
                    </Stack>
                )}

                {items.map((item, index) => (
                    <TimeLinePost
                        key={item.createdMs}
                        item={item}
                        isSaving={isSaving}
                        isEditing={editingIndex === index}
                        onEdit={() => setEditingIndex(index)}
                        onCancel={() => setEditingIndex(-1)}
                        onSave={(newText) => {
                            handleSave([
                                ...items.slice(0, index),
                                { ...item, text: newText },
                                ...items.slice(index + 1),
                            ]).then(() => {
                                setEditingIndex(-1);
                            });
                        }}
                    />
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
function TimeLinePost({
    item,
    isSaving,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}: {
    item: TimelineItem;
    isSaving: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (newItem: string) => void;
    onCancel: () => void;
}) {
    const [newText, setNewText] = useState(item.text);
    const { role } = useAuthContext();

    useEffect(() => setNewText(item.text), [item]);

    return (
        <CardContent key={item.createdMs}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <TimeStamp date={new Date(item.createdMs)} />
                {role === "admin" && (
                    <Button
                        sx={{
                            opacity: 0,
                            "div:hover > div > &": {
                                opacity: 1,
                            },
                            transition: "0.2s",
                        }}
                        onClick={() => onEdit()}
                        startIcon={<Edit />}
                        size="small"
                        variant="outlined"
                    >
                        Edit
                    </Button>
                )}
            </Stack>
            {isEditing ? (
                <Stack spacing={2}>
                    <BlogTextfield
                        disabled={isSaving}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && !e.shiftKey && onSave(newText)
                        }
                        autoFocus
                        label="Edit Post"
                        rows={4}
                        multiline
                        value={newText}
                    />
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent={"flex-end"}
                    >
                        <Button
                            disabled={isSaving}
                            onClick={() => {
                                setNewText(item.text);
                                onCancel();
                            }}
                            startIcon={<Cancel />}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <ProgressButton
                            disabled={isSaving}
                            onClick={() => onSave(newText)}
                            startIcon={<Save />}
                            showProgress={isSaving}
                            variant="contained"
                        >
                            Save
                        </ProgressButton>
                    </Stack>
                </Stack>
            ) : (
                <MarkdownRender>{item.text}</MarkdownRender>
            )}
        </CardContent>
    );
}
function TextPostView({ blogPost }: { blogPost: BlogPost }) {
    return (
        <Box sx={{ marginTop: "30px" }}>
            <TimeStamp date={blogPost.updated} />
            <h1>{blogPost.title}</h1>
            <MarkdownRender>{blogPost.content}</MarkdownRender>
        </Box>
    );
}
