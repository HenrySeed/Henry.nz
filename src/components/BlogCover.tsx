import { Box, SxProps } from "@mui/material";
import { useImage } from "../hooks/useImage";
import { Blurhash } from "react-blurhash";

export function BlogCover({ src, sx }: { src: string; sx?: SxProps }) {
    const { blobUrl, blurhash } = useImage(src);
    const imageName = src.split("/").slice(-1);

    const showBlurHash = !blobUrl && blurhash;

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
        >
            {blurhash && (
                <Blurhash
                    hash={blurhash}
                    width={"100%"}
                    height={"100%"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                    style={{
                        opacity: showBlurHash ? 1 : 0,
                        transition: "1s",
                    }}
                />
            )}
        </Box>
    );
}
