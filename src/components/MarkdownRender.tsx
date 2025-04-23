import "./markdownStyle.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown, { ExtraProps } from "react-markdown";
import gfm from "remark-gfm";
import { CaptionedImage } from "./CaptionedImage";
import { getImagePaths } from "../utilities";
import { useImage } from "../hooks/useImage";

type MarkdownCodeProps = React.ClassAttributes<HTMLElement> &
    React.HTMLAttributes<HTMLElement> &
    ExtraProps;

function CodeBlock({ children, className, node, ...rest }: MarkdownCodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
        return (
            <SyntaxHighlighter
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={vscDarkPlus}
            />
        );
    } else {
        return (
            <code {...rest} className={className}>
                {children}
            </code>
        );
    }
}

type MarkdownImageProps = React.ClassAttributes<HTMLImageElement> &
    React.ImgHTMLAttributes<HTMLImageElement> &
    ExtraProps;

function CustomImage({ node }: MarkdownImageProps) {
    const src = node?.properties.src as string;
    const { full } = getImagePaths(src);
    const { blobUrl } = useImage(src, src.endsWith(".gif") ? "full" : "large");
    const imageName = full.split("/").slice(-1);

    return (
        <span
            onClick={() =>
                window.open(
                    `/blog/images/${imageName}`,
                    "_blank",
                    "noopener,noreferrer"
                )
            }
            style={{ cursor: "pointer" }}
        >
            <CaptionedImage
                caption={node?.properties.alt as string}
                src={blobUrl}
            />
        </span>
    );
}

type MarkdownLinkProps = React.ClassAttributes<HTMLLinkElement> &
    React.LinkHTMLAttributes<HTMLLinkElement> &
    ExtraProps;
function CustomLink({ href, children }: MarkdownLinkProps) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
}

export default function MarkdownRender({ children }: { children: string }) {
    return (
        <Markdown
            remarkPlugins={[gfm]}
            components={{
                code: CodeBlock,
                img: CustomImage,
                link: CustomLink,
            }}
        >
            {children}
        </Markdown>
    );
}
