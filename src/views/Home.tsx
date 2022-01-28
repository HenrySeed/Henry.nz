import Snake from "../components/Snake";
import Logo from "../components/Logo";
import { Grid } from "@material-ui/core";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import "./Home.css";
import "./App.css";
import { CenteredCircular } from "../components/Loading";
import MetaTags from "react-meta-tags";
import "../types.d";
import { RollingTile } from "../components/RollingTile";

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
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
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
    const articleIndexes = [4, 6];
    const tiles = [];
    for (const [i, val] of projects.entries()) {
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

    return (
        <div>
            <MetaTags>
                <title>Henry Seed | Software Developer</title>
            </MetaTags>
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
                        <Grid item xs={12}>
                            <CenteredCircular />
                        </Grid>
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default Home;
