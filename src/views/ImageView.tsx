import { useParams } from "react-router";
import { useImage } from "../hooks/useImage";
import Box from "@mui/material/Box";
import { CenteredProgress } from "../components/Loading";
import { imageHostingUrl } from "../utilities";

export function ImageView() {
    const { path } = useParams();
    const { url, loading } = useImage(
        `${imageHostingUrl}/images/` + (path ?? "")
    );

    return (
        <Box style={{ height: "100vh", margin: "auto", display: "block" }}>
            {loading && <CenteredProgress />}
            {/* eslint-disable-next-line */}
            <img
                alt={"Fullscreen image from the blog"}
                src={url}
                style={{ height: "100vh", margin: "auto", display: "block" }}
            />
        </Box>
    );
}
