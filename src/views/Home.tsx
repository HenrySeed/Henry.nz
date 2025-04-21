import {Snake} from "../components/Snake";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { Link } from "react-router";
import "./Home.css";
import "./App.css";
import { CenteredCircular } from "../components/Loading";
import "../types.d";
import { RollingTile } from "../components/RollingTile";
import { Grid } from "@mui/material";
import { useEffect } from "react";

export interface Project {
    id: string;
    type: "Project";
    title: string;
    markdown: string;
    url: string;
    cover: string;
    demoUrl: string;
    npmURL: string;
    lastUpdated: string;
}

export interface Article {
    id: string;
    type: "Article";
    title: string;
    cover: {
        src: string;
        caption: string;
    };
    contents: string;
    draft: boolean;
    genre: string;
    date: any;
    tags: string[];
}

export function ProjectTile({ proj }: { proj: Article | Project }) {
    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

    return (
        <Link to={`/portfolio/${proj.id}`}>
            <div className="projCard">
                {isTouchDevice ? (
                    <div
                        className="imageContainer"
                        style={{
                            backgroundImage: `url(${
                                typeof proj.cover === "string"
                                    ? proj.cover
                                    : proj.cover.src
                            })`,
                        }}
                    >
                        <h3>{proj.title}</h3>
                    </div>
                ) : (
                    <RollingTile
                        bottom={
                            <div className="projHover">
                                <h3>{proj.title}</h3>
                            </div>
                        }
                        front={
                            <div
                                className="imageContainer"
                                style={{
                                    backgroundImage: `url(${
                                        typeof proj.cover === "string"
                                            ? proj.cover
                                            : proj.cover.src
                                    })`,
                                }}
                            ></div>
                        }
                    />
                )}
            </div>
        </Link>
    );
}

export function ProjectTileGrid({ proj }: { proj: Article | Project }) {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
            <ProjectTile proj={proj} />
        </Grid>
    );
}

function Home({
    projects,
    articles,
}: {
    projects: Project[];
    articles: Article[];
}) {
    const favArticles = [
        "Half-a-Cup",
        "ProjectHub",
        "heuristic-automata-matching-of-nlp-with-home-assistant-applications",
        "Unraid-Startpage",
        "react-screenshot-frame",
        "node-dungen",
        "Incoherent",
    ];

    const articleIndexes = [4, 6];
    const tiles = [];
    for (const val of favArticles.map((id) =>
        projects.find((p) => p.id === id)
    )) {
        if (!val) continue;
        tiles.push(<ProjectTileGrid proj={val} key={val.id} />);
    }
    for (const [i, val] of projects
        .filter((p) => !favArticles.includes(p.id))
        .entries()) {
        const artIndex = articleIndexes.indexOf(i);
        const article = artIndex > -1 ? articles[artIndex] : undefined;

        if (article) {
            tiles.push(
                <ProjectTileGrid
                    proj={article}
                    key={article.id || "key_" + i}
                />
            );
        }
        tiles.push(<ProjectTileGrid proj={val} key={val.id} />);
    }

    useEffect(() => {
        document.title = "Henry Seed | Software Developer";
    }, []);

    return (
        <div>
            <div id="sketchHolder">
                <Snake />
            </div>
            <div id="homeContainer">
                <Logo className="title" />
                <div className="buttons">
                    <Button to="https://github.com/HenrySeed">GitHub</Button>
                    <Button to="/aboutme" newTab={false}>
                        Who am I
                    </Button>
                    <Button to="https://www.linkedin.com/in/seed/">
                        LinkedIn
                    </Button>
                </div>
            </div>
            <div id="projectContainer">
                <Grid container spacing={0}>
                    {tiles}
                    {tiles.length === 0 && (
                        <Grid size={12}>
                            <CenteredCircular />
                        </Grid>
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default Home;
