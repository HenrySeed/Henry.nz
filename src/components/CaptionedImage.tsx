import { CSSProperties } from "@mui/material";
import { Blurhash } from "react-blurhash";

export function CaptionedImage({
    src,
    imageRatio,
    blurhash,
    caption,
    style,
}: {
    src: string;
    imageRatio?: number;
    blurhash?: string;
    caption: string;
    style?: React.CSSProperties;
}) {
    const imageStyle: CSSProperties = {
        maxHeight: "100%",
        maxWidth: "100%",
        aspectRatio: imageRatio,
    };

    return (
        <span
            style={{
                position: "relative",
                display: "block",
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
                background: "#111",
                ...imageStyle,
                ...style,
            }}
        >
            {blurhash && (
                <span
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: src === "" ? 1 : 0,
                        transition: "1s",
                    }}
                >
                    <Blurhash hash={blurhash} width="100%" height="100%" />
                </span>
            )}
            {src && (
                <img
                    alt="captioned"
                    src={src}
                    style={{
                        ...imageStyle,
                    }}
                />
            )}
            <span
                style={{
                    position: "absolute",
                    display: "block",
                    color: "white",
                    background: "black",
                    padding: "3px 10px 5px 10px",
                    fontSize: "11pt",
                    margin: "10px",
                    right: "0",
                    bottom: "0",
                    lineHeight: "normal",
                }}
            >
                {caption}
            </span>
        </span>
    );
}
