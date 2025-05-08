import { useParams } from "react-router";
import { useImage } from "../hooks/useImage";
import Box from "@mui/material/Box";
import { CenteredProgress } from "../components/Loading";

export function ImageView() {
    const { path } = useParams();
    const { blobUrl, loading, imageRatio } = useImage(
        `/images/` + (path ?? "")
    );

    const isHorizontal = imageRatio < 1;
    const isVertical = imageRatio > 1;

    return (
        <Box style={{ height: "100vh", margin: "auto", display: "block" }}>
            {loading && <CenteredProgress />}
            {/* eslint-disable-next-line */}
            <img
                alt={"Fullscreen image from the blog"}
                src={blobUrl}
                style={{
                    ...(isHorizontal && { width: "100vw" }),
                    ...(isVertical && { height: "100vh" }),
                    maxHeight: "100vh",
                    maxWidth: "100vw",
                    margin: "auto",
                    display: "block",
                }}
            />
        </Box>
    );
}
