import { useEffect } from "react";
import { SignInButton } from "../../components/SignInButton";
import { CenteredProgress } from "../../components/Loading";
import {
    Button,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Add, Settings } from "@mui/icons-material";
import { TimeStamp } from "../../components/TimeStamp";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { BlogPost } from "../../types";
import { useImage } from "../../hooks/useImage";
import { useAuthContext } from "../../hooks/AuthContext";

export function HomeView() {
    const navigate = useNavigate();
    const { user, loading: loadingAuth, role } = useAuthContext();
    const { blogPosts, loading: loadingPosts, refetch } = useBlogPosts();

    useEffect(() => refetch(), [user, refetch]);

    return (
        <div className="projWrapper" style={{ overflowX: "visible" }}>
            <Stack
                direction="row"
                justifyContent={"space-between"}
                spacing={2}
                alignItems="center"
                sx={{ marginBottom: "50px" }}
            >
                <h1>Hank's Blog</h1>
                {user && (
                    <Stack
                        spacing={1}
                        direction="row"
                        sx={{ height: "36.5px" }}
                    >
                        <SignInButton size="small" />
                        {role === "admin" && (
                            <Button
                                onClick={() => navigate("settings")}
                                size="small"
                                variant="outlined"
                                startIcon={<Settings />}
                            >
                                Settings
                            </Button>
                        )}
                    </Stack>
                )}
            </Stack>

            <Stack spacing={2} justifyContent="center">
                {/* We are loading the user or the data */}
                {(loadingAuth || (user && loadingPosts)) && (
                    <CenteredProgress />
                )}

                {/* We know the user is signed out */}
                {!loadingAuth && !user && (
                    <Stack
                        direction="row"
                        justifyContent="center"
                        sx={{ paddingY: "30vh" }}
                    >
                        <SignInButton size="large" />
                    </Stack>
                )}

                {!loadingAuth && role === null && (
                    <Typography
                        sx={{
                            textAlign: "center",
                            paddingTop: "20vh",
                            fontFamily: "monospace",
                        }}
                    >
                        You aren't supposed to be here...
                    </Typography>
                )}

                {/* We have a user and posts */}
                {user && role && !loadingPosts && (
                    <Grid container spacing={4}>
                        {role === "admin" && (
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
                        )}
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
    const { blobUrl, loading } = useImage(post.cover, "thumb");

    return (
        <CardActionArea
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ minHeight: "100%" }}>
                {blobUrl && (
                    <CardMedia image={blobUrl} sx={{ height: "170px" }} />
                )}
                {post.cover && loading && (
                    <CardMedia sx={{ height: "170px" }}>
                        <Skeleton sx={{ height: "170px", transform: "none" }} />
                    </CardMedia>
                )}
                <CardContent>
                    <Stack spacing={1}>
                        <TimeStamp date={new Date(post.updated)} />
                        <Typography variant="h5">{post.title}</Typography>

                        {!post.cover && (
                            <>
                                {post.type === "Text Post" && (
                                    <Typography variant="body2">
                                        {post.content.split("\n")[0]}
                                    </Typography>
                                )}
                                {post.type === "Timeline Post" && (
                                    <Typography variant="body2">
                                        {`${
                                            JSON.parse(post.content).length
                                        } posts`}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Stack>
        </CardActionArea>
    );
}
