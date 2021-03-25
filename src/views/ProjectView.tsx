import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Project } from "../views/Home";
import Logo from "../components/Logo";
import "./ProjectView.css";
import MarkdownRender from "../components/MarkdownRender";
import githubLogo from "../res/GitHub-Mark-Light-64px.png";
import npmLogo from "../res/npm_logo.png";

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
                        <img src={githubLogo} />
                        View on GitHub
                    </a>
                    {proj.npmURL !== "" && (
                        <a
                            href={proj.npmURL}
                            className="button"
                            style={{
                                fontSize: "12pt",
                                padding: "10px",
                            }}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={npmLogo} width="32px" height="13.3px" />
                            View on NPM
                        </a>
                    )}

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