import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Project } from "../views/Home";
import Logo from "../components/Logo";
import "./ProjectView.css";
import MarkdownRender from "../components/MarkdownRender";
import githubLogo from "../res/GitHub-Mark-Light-64px.png";
import npmLogo from "../res/npm_logo.png";
import MetaTags from "react-meta-tags";

function ProjectView({ projects }: { projects: Project[] }) {
    let { slug } = useParams<any>();
    const proj = projects.find((project) => project.id === slug);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    });

    if (proj) {
        const descr = proj.markdown
            .split("\n")
            .find(
                (val) => val[0] !== "#" && val[0] !== "!" && val.trim() !== ""
            )
            ?.split(/\?|\.!/g)[0]
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .trim();

        // console.log(proj.markdown);

        return (
            <span>
                <MetaTags>
                    <title>{`Henry Seed - ${proj.title}`}</title>
                </MetaTags>
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
                            <img src={githubLogo} alt="github logo" />
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
                                <img
                                    alt="npm logo"
                                    src={npmLogo}
                                    width="32px"
                                    height="13.3px"
                                />
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
            </span>
        );
    } else {
        return <></>;
    }
}

export default ProjectView;
