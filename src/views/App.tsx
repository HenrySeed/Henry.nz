import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import ProjectView from "./ProjectView";
import { Project } from "../components/Portfolio";
import React, { useEffect, useState } from "react";
import { firebase } from "../components/firebase";

function shuffle(array: any[]) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

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
                        projs.push(doc.data() as Project);
                    });
                    const blackList = ["HenrySeed", "Henry.nz"];
                    const filteredProj = projs.filter(
                        (proj) =>
                            proj.cover !== "" && !blackList.includes(proj.id)
                    );
                    shuffle(filteredProj);
                    setProjects(filteredProj);
                }
            });
    }, []);

    useEffect(() => {
        console.log(
            "\n\
 _    _                          _____               _ \n\
| |  | |                        / ____|             | |\n\
| |__| | ___ _ __  _ __ _   _  | (___   ___  ___  __| |\n\
|  __  |/ _ \\ '_ \\| '__| | | |  \\___ \\ / _ \\/ _ \\/ _` |\n\
| |  | |  __/ | | | |  | |_| |  ____) |  __/  __/ (_| |\n\
|_|  |_|\\___|_| |_|_|   \\__, | |_____/ \\___|\\___|\\__,_|\n\
                         __/ |                         \n\
                        |___/                          \n\
Site: http://henry.nz\n\
Github: http://github.com/HenrySeed\n\
LinkedIn: http://www.linkedin.com/in/seed"
        );
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
                    <div style={{ marginBottom: "10px" }}>
                        © Henry Seed {new Date().getFullYear()}
                    </div>
                    <a
                        href="https://github.com/HenrySeed"
                        target="_blank"
                        style={{ marginRight: "10px" }}
                    >
                        GitHub
                    </a>
                    |
                    <a
                        href="https://www.linkedin.com/in/seed/"
                        target="_blank"
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
