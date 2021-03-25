import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import ProjectView from "./ProjectView";
import { Project } from "./Home";
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
        console.log(`
 _    _                          _____               _ 
| |  | |                        / ____|             | |
| |__| | ___ _ __  _ __ _   _  | (___   ___  ___  __| |
|  __  |/ _ \\ '_ \\| '__| | | |  \\___ \\ / _ \\/ _ \\/ _  |
| |  | |  __/ | | | |  | |_| |  ____) |  __/  __/ (_| |
|_|  |_|\\___|_| |_|_|   \\__, | |_____/ \\___|\\___|\\__,_|
                         __/ |                         
                        |___/                          
Site: http://henry.nz\n\
Github: http://github.com/HenrySeed\n\
LinkedIn: http://www.linkedin.com/in/seed`);
    }, []);

    return (
        <div className="App">
            <Router>
                <div>
                    <Switch>
                        <Route path="/portfolio/:slug">
                            <ProjectView projects={projects} />
                        </Route>
                        <Route path="/">
                            <Home projects={projects} />
                        </Route>
                    </Switch>
                </div>
            </Router>
            <footer>
                <p>
                    <span style={{ marginBottom: "10px", display: "block" }}>
                        © Henry Seed {new Date().getFullYear()}
                    </span>
                    <a
                        href="https://github.com/HenrySeed"
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: "10px" }}
                    >
                        GitHub
                    </a>
                    |
                    <a
                        href="https://www.linkedin.com/in/seed/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: "10px" }}
                    >
                        LinkedIn
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
