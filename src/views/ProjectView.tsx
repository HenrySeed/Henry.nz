import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Article, Project, ProjectTile } from "../views/Home";
import Logo from "../components/Logo";
import "./ProjectView.css";
import MarkdownRender from "../components/MarkdownRender";
import githubLogo from "../res/GitHub-Mark-Light-64px.png";
import npmLogo from "../res/npm_logo.png";
import MetaTags from "react-meta-tags";
import { CaptionedImage } from "../components/CaptionedImage";
import { CenteredCircular } from "../components/Loading";
import { shuffle } from "../utilities";

function ProjectView({
    projects,
    articles,
}: {
    projects: Project[];
    articles: Article[];
}) {
    const scrollRef = useRef(null);
    let { slug } = useParams<any>();
    const proj =
        projects.find((project) => project.id === slug) ||
        articles.find((val) => val.id === slug);

    useEffect(() => {
        window.scrollTo({ top: 0 });
        if (scrollRef.current) {
            (scrollRef.current as any).scrollTo(0, 0);
        }
    });

    if (proj === undefined) {
        return (
            <div className="projWrapper">
                <Link to="/">
                    <Logo className="projectLogo" />
                </Link>
                <div style={{ marginTop: "100px" }}>
                    <CenteredCircular />
                </div>
            </div>
        );
    }

    let date;
    if (proj.type === "Article") {
        date = new Date(proj.date.seconds * 1000);
    } else {
        date = new Date(proj.lastUpdated);
    }

    // strip the leading title out of project
    let title = proj.title;

    if (proj.type === "Project") {
        if (proj.markdown.split("\n")[0][0] === "#") {
            title = proj.markdown.split("\n")[0].replace(/#/g, "").trim();
            proj.markdown = proj.markdown.split("\n").slice(1).join("\n");
        }
    }

    let alltiles: (Article | Project)[] = articles;
    alltiles = alltiles.concat(projects).filter((val) => val.id !== proj.id);
    alltiles = shuffle(alltiles);

    return (
        <span>
            <MetaTags>
                <title>{`Henry Seed - ${title}`}</title>
            </MetaTags>
            <div className="projWrapper">
                <Link to="/">
                    <Logo className="projectLogo" />
                </Link>

                <div className="projButtons">
                    {proj.type === "Project" && (
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
                    )}
                    {proj.type === "Project" && proj.npmURL !== "" && (
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

                    {proj.type === "Project" && proj.demoUrl && (
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
                    )}
                </div>
                <div className="projMarkdown">
                    <h1>{title}</h1>
                    {date && (
                        <div
                            style={{
                                opacity: 0.7,
                                margin: "-20px 0 40px 0",
                            }}
                        >
                            Last updated{": "}
                            {date.getDate()}/{date.getMonth() + 1}/
                            {date.getFullYear()}
                        </div>
                    )}
                    {proj.type === "Project" ? (
                        <MarkdownRender>{proj.markdown}</MarkdownRender>
                    ) : (
                        <>
                            <CaptionedImage
                                src={proj.cover.src}
                                caption={proj.cover.caption}
                            />
                            <MarkdownRender>{proj.contents}</MarkdownRender>
                        </>
                    )}
                </div>
            </div>
            <div className="projScroller">
                <h2>More like this</h2>
                <div className="projectTiles" ref={scrollRef}>
                    {alltiles.map((tile) => (
                        <div className="tile" key={tile.id}>
                            <ProjectTile proj={tile} key={tile.id} />
                        </div>
                    ))}
                </div>
            </div>
        </span>
    );
}

export default ProjectView;
