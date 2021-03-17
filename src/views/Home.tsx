import React from "react";
import "./App.css";
import Snake from "../components/Snake";
import Portfolio, { Project } from "../components/Portfolio";
import Logo from "../components/Logo";

function Home({ projects }: { projects: Project[] }) {
    return (
        <div>
            <div id="sketchHolder">
                <Snake />
            </div>
            <div id="homeContainer">
                <Logo className="title" />

                <div className="buttons">
                    <a
                        href="https://github.com/HenrySeed"
                        className="button"
                        target="_blank"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/seed/"
                        className="button"
                        target="_blank"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
            <div id="projectContainer">
                <Portfolio projects={projects} />
            </div>
        </div>
    );
}

export default Home;
