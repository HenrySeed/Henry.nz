import React, { useEffect, useState } from "react";
import marked from "marked";
import "./markdownStyle.css";

export default function MarkdownRender({ children }: { children: string }) {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        setMarkdown(marked(children));
    }, [children]);

    return <span dangerouslySetInnerHTML={{ __html: markdown }}></span>;
}
