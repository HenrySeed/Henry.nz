import "./CaptionedImage.css";

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
        <a href={src} target="_blank" rel="noopener noreferrer">
            <span className="captionedImage">
                <img src={src} style={style} alt={caption} />
                <span className="imageCaption">{caption}</span>
            </span>
        </a>
    );
}
