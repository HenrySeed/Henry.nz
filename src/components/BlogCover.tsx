import { Box, SxProps } from "@mui/material";
import { useImage } from "../hooks/useImage";
import { useNavigate } from "react-router";

export function BlogCover({ src, sx }: { src: string; sx?: SxProps }) {
    const { blobUrl } = useImage(src);
    const imageName = src.split("/").slice(-1);

    return (
        <Box
            onClick={() =>
                window.open(
                    `/blog/images/${imageName}`,
                    "_blank",
                    "noopener,noreferrer"
                )
            }
            sx={{
                cursor: "pointer",
                width: "100%",
                height: "400px",
                backgroundImage: `url(${blobUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...sx,
            }}
        />
    );
}
