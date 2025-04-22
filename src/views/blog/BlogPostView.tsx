import { setDoc, doc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { db } from "../../components/firebase";
import {
    Box,
    Button,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import MarkdownRender from "../../components/MarkdownRender";
import { ArrowBackIos, Edit, PushPin } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { CenteredProgress } from "../../components/Loading";
import { TimeStamp } from "../../components/TimeStamp";
import { useBlogPost } from "../../hooks/useBlogPost";
import { BlogPost, TimelineItem } from "../../types";
import { BlogPostEditView } from "./BlogPostEditView";
import { BlogTextfield } from "../../components/BlogTextfield";

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
        onPost();
        setSaving(false);
    }

    return (
        <>
            <h1 style={{ marginBottom: "40px" }}>{blogPost.title}</h1>
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <BlogTextfield
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

                    <Stack
                        direction="row"
                        justifyContent={"flex-end"}
                        spacing={2}
                    >
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
