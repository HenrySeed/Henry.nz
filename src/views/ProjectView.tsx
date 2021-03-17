import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Project } from "../components/Portfolio";
import Logo from "../components/Logo";
import "./ProjectView.css";
import MarkdownRender from "../components/MarkdownRender";

function ProjectView({ projects }: { projects: Project[] }) {
    let { slug } = useParams<any>();
    const proj = projects.find((project) => project.id === slug);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    });

    if (proj) {
        return (
            <div className="projWrapper">
                <Link to="/">
                    <Logo className="projectLogo" />
                </Link>
                <div className="projButtons">
                    <a
                        href={proj.url}
                        className="button"
                        style={{
                            fontSize: "12pt",
                            padding: "10px",
                        }}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src="/res/GitHub-Mark-Light-64px.png" />
                        View on GitHub
                    </a>
                    {proj.demoUrl ? (
                        <a
                            href={proj.demoUrl}
                            className="button"
                            style={{
                                fontSize: "12pt",
                                padding: "10px",
                            }}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Demo
                        </a>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="projMarkdown">
                    <MarkdownRender>{proj.markdown}</MarkdownRender>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default ProjectView;
