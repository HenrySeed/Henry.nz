import React from "react";
import "./index.css";
import App from "./views/App";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./hooks/AuthContext";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#53a6ff",
        },
        info: {
            main: "#ffffff",
        },
    },
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
