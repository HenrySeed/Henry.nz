import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./views/App";
import DocumentMeta from "react-document-meta";

const meta = {
    title: "Henry Seed | Software Developer",
    description: "Hi I'm Henry, a full-stack developer from New Zealand 🥝",
    meta: {
        charset: "utf-8",
        name: {
            keywords: "software,henry,henry seed",
        },
    },
};

ReactDOM.render(
    <DocumentMeta {...meta}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </DocumentMeta>,
    document.getElementById("root")
);
