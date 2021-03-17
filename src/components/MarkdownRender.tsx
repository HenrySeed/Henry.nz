import "./markdownStyle.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

function CodeBlock({ value, language }: { value: string; language?: string }) {
    return (
        <SyntaxHighlighter language={language} style={vscDarkPlus}>
            {value}
        </SyntaxHighlighter>
    );
}

export default function MarkdownRender({ children }: { children: string }) {
    return (
        <ReactMarkdown
            source={children}
            renderers={{ code: CodeBlock }}
            plugins={[gfm]}
        />
    );
}
