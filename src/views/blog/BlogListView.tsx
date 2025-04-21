import { useEffect } from "react";
import { SignInButton } from "../../components/SignInButton";
import { CenteredProgress } from "../../components/Loading";
import {
    Button,
    CardActionArea,
    CardContent,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Add } from "@mui/icons-material";
import { TimeStamp } from "../../components/TimeStamp";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { BlogPost } from "../../types";

export function BlogList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { blogPosts, loading, refetch } = useBlogPosts();

    useEffect(() => refetch(), [user, refetch]);

    if (!user) {
        return (
            <Stack
                direction="row"
                justifyContent="center"
                sx={{ paddingY: "30vh" }}
            >
                <SignInButton />
            </Stack>
        );
    }

    return (
        <div className="projWrapper">
            <Stack
                direction="row"
                justifyContent={"space-between"}
                spacing={2}
                sx={{ marginBottom: "50px" }}
            >
                <h1>Hank's Blog</h1>
                <SignInButton />
            </Stack>

            <Stack spacing={2} justifyContent="center">
                {loading ? (
                    <CenteredProgress />
                ) : (
                    <Grid container spacing={4}>
                        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
                            <Button
                                sx={{ height: "100%", width: "100%" }}
                                variant="outlined"
                                onClick={() => navigate("/blog/new")}
                                startIcon={<Add />}
                            >
                                New Post
                            </Button>
                        </Grid>
                        {blogPosts.map((post, i) => (
                            <Grid
                                size={{ md: 4, sm: 6, xs: 12 }}
                                key={`card-${i}`}
                            >
                                <BlogPostCard post={post} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Stack>
        </div>
    );
}

function BlogPostCard({ post }: { post: BlogPost }) {
    const navigate = useNavigate();

    return (
        <CardActionArea
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{ height: "100%" }}
        >
            <CardContent
                sx={{
                    height: "100%",
                    top: 0,
                    position: "relative",
                }}
            >
                <Stack spacing={1}>
                    <TimeStamp date={new Date(post.updated)} />
                    <Typography variant="h5">{post.title}</Typography>

                    {post.type === "Text Post" && (
                        <Typography variant="body2">
                            {post.content.split("\n")[0]}
                        </Typography>
                    )}
                    {post.type === "Timeline Post" && (
                        <Typography variant="body2">
                            {`${JSON.parse(post.content).length} posts`}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </CardActionArea>
    );
}
