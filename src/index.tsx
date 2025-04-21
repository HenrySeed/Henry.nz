import React from "react";
import "./index.css";
import App from "./views/App";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#53a6ff",
        },
    },
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
