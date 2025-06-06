import "./App.css";
import { Route, Routes, useLocation } from "react-router";
import ProjectView from "./ProjectView";
import Home from "./Home";
import { AboutMeView } from "./AboutMeView";
import { useEffect } from "react";
import { HomeView } from "./blog/HomeView";
import { BlogPostView } from "./blog/PostView";
import { useProjects } from "../hooks/useProjects";
import { useArticles } from "../hooks/useArticles";
import { ImageView } from "./ImageView";
import { SettingsView } from "./blog/SettingsView";

function App() {
    const { projects } = useProjects();
    const { articles } = useArticles();
    const location = useLocation();

    useEffect(() => {
        console.log(`

     _    _                          _____               _ 
    | |  | |                        / ____|             | |
    | |__| | ___ _ __  _ __ _   _  | (___   ___  ___  __| |
    |  __  |/ _ \\ '_ \\| '__| | | |  \\___ \\ / _ \\/ _ \\/ _  |
    | |  | |  __/ | | | |  | |_| |  ____) |  __/  __/ (_| |
    |_|  |_|\\___|_| |_|_|   \\__, | |_____/ \\___|\\___|\\__,_|
                             __/ |                         
                            |___/     

    Site:     http://henry.nz

    Github:   http://github.com/HenrySeed

    LinkedIn: http://www.linkedin.com/in/seed
    
    
    `);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location]);

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/portfolio/:slug"
                    element={
                        <ProjectView projects={projects} articles={articles} />
                    }
                />
                <Route path="/aboutme" element={<AboutMeView />} />
                <Route path="/blog" element={<HomeView />} />
                <Route path="/blog/settings" element={<SettingsView />} />
                <Route path="/blog/images/:path" element={<ImageView />} />
                <Route path="/blog/:id" element={<BlogPostView />} />

                <Route
                    path="/"
                    element={<Home articles={articles} projects={projects} />}
                />
            </Routes>
            <footer>
                <p>
                    <span style={{ marginBottom: "10px", display: "block" }}>
                        © Henry Seed {new Date().getFullYear()}
                    </span>
                    <a
                        href="https://github.com/HenrySeed"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                    {" | "}
                    <a href="/aboutme">About me</a>
                    {" | "}
                    <a
                        href="https://www.linkedin.com/in/seed/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        LinkedIn
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
