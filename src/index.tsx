import React from "react";
import "./index.css";
import App from "./views/App";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";

// const meta = {
//     title: "Henry Seed | Software Developer",
//     description: "Hi I'm Henry, a full-stack developer from New Zealand 🥝",
//     meta: {
//         charset: "utf-8",
//         name: {
//             keywords: "software,henry,henry seed",
//         },
//     },
// };

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
