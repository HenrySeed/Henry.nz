export function CaptionedImage({
    src,
    caption,
    style,
}: {
    src: string;
    caption: string;
    style?: React.CSSProperties;
}) {
    return (
        <span
            style={{
                position: "relative",
                display: "block",
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
                ...style,
            }}
        >
            <img
                src={src}
                style={{
                    maxHeight: "600px",
                    minHeight: "300px",
                    minWidth: "300px",
                }}
                alt={caption}
            />
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
