import "./markdownStyle.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { CaptionedImage } from "./CaptionedImage";

function CodeBlock({ value, language }: { value: string; language?: string }) {
    return (
        <SyntaxHighlighter language={language} style={vscDarkPlus}>
            {value}
        </SyntaxHighlighter>
    );
}

function CustomImage(val: { src: string; alt: string }) {
    return <CaptionedImage caption={val.alt} src={val.src} />;
}

function CustomLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactElement[];
}) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
}

export default function MarkdownRender({ children }: { children: string }) {
    return (
        <ReactMarkdown
            source={children}
            renderers={{
                code: CodeBlock,
                image: CustomImage,
                link: CustomLink,
            }}
            plugins={[gfm]}
        />
    );
}
