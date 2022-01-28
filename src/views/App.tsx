import "./App.css";
import { Switch, Route, useLocation } from "react-router-dom";
import Home, { Article } from "./Home";
import ProjectView from "./ProjectView";
import { Project } from "./Home";
import { AboutMeView } from "./AboutMeView";
import { useEffect, useState } from "react";
import { firebase } from "../components/firebase";

const npmProjects = [
    {
        id: "ASCII-WorldMap-NPM",
        url: "https://www.npmjs.com/package/ascii-worldmap",
    },
    {
        id: "react-screenshot-frame",
        url: "https://www.npmjs.com/package/react-window-frame",
    },
];

function App() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const location = useLocation();

    useEffect(() => {
        firebase
            .firestore()
            .collection("projects")
            .get()
            .then((snap) => {
                if (snap) {
                    const projs: Project[] = [];
                    snap.forEach((doc) => {
                        const proj = doc.data() as Project;
                        proj.npmURL =
                            npmProjects.find((val) => val.id === proj.id)
                                ?.url || "";
                        proj.type = "Project";
                        projs.push(proj);
                    });
                    const blackList = ["HenrySeed", "Henry.nz"];
                    const filteredProj = projs.filter(
                        (proj) =>
                            proj.cover !== "" && !blackList.includes(proj.id)
                    );

                    // sort projects by last updated
                    filteredProj.sort((a, b) =>
                        b.lastUpdated < a.lastUpdated
                            ? -1
                            : b.lastUpdated > a.lastUpdated
                            ? 1
                            : 0
                    );

                    setProjects(filteredProj);
                }
            });
    }, []);
    useEffect(() => {
        firebase
            .firestore()
            .collection("articles")
            .get()
            .then((snap) => {
                if (snap) {
                    let artics: Article[] = [];
                    snap.forEach((doc) => {
                        const article = doc.data() as Article;
                        article.type = "Article";
                        artics.push(article);
                    });

                    artics = artics.filter((val) => val.draft !== true);

                    // sort projects by last updated
                    artics.sort((a, b) =>
                        b.date < a.date ? -1 : b.date > a.date ? 1 : 0
                    );

                    setArticles(artics);
                }
            });
    }, []);

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
            <Switch>
                <Route path="/portfolio/:slug">
                    <ProjectView projects={projects} articles={articles} />
                </Route>
                <Route path="/aboutme">
                    <AboutMeView />
                </Route>
                <Route path="/">
                    <Home articles={articles} projects={projects} />
                </Route>
            </Switch>
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
