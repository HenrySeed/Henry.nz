import { useParams } from "react-router";
import { useImage } from "../hooks/useImage";
import Box from "@mui/material/Box";
import { CenteredProgress } from "../components/Loading";

export function ImageView() {
    const { path } = useParams();
    const { blobUrl, loading } = useImage(`/images/` + (path ?? ""));

    return (
        <Box style={{ height: "100vh", margin: "auto", display: "block" }}>
            {loading && <CenteredProgress />}
            {/* eslint-disable-next-line */}
            <img
                src={blobUrl}
                style={{
                    maxHeight: "100vh",
                    maxWidth: "100vw",
                    margin: "auto",
                    display: "block",
                }}
            />
        </Box>
    );
}
