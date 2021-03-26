import Snake from "../components/Snake";
import Woods from "../components/Woods";
import Logo from "../components/Logo";
import { Grid } from "@material-ui/core";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./Home.css";
import "./App.css";
import { useState } from "react";

export interface Project {
    id: string;
    title: string;
    markdown: string;
    url: string;
    cover: string;
    demoUrl: string;
    npmURL: string;
    lastUpdated: string;
}

function Home({ projects }: { projects: Project[] }) {
    const fillerProj = { id: "", name: "" };
    const [demoChoice, setDemoChoice] = useState(Math.floor(Math.random() * 2));

    const CustomProgress = withStyles((theme) => ({
        root: {
            height: 3,
        },
        colorPrimary: {
            backgroundColor: "#111111",
        },
        bar: {
            backgroundColor: "#555555",
        },
    }))(LinearProgress);

    return (
        <div>
            <div id="sketchHolder">
                {demoChoice === 0 ? <Woods /> : <Snake />}
            </div>
            <div id="homeContainer">
                <Logo className="title" />
                <div className="buttons">
                    <Button to="https://github.com/HenrySeed">GitHub</Button>
                    <Button to="https://www.linkedin.com/in/seed/">
                        LinkedIn
                    </Button>
                </div>
            </div>
            <div id="projectContainer">
                <Grid container spacing={5}>
                    <Grid item xs={12} className="filterPanel"></Grid>
                    {projects.length > 0
                        ? projects.map((val) => (
                              <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={6}
                                  lg={4}
                                  xl={3}
                                  key={val.id}
                              >
                                  <Link to={`/portfolio/${val.id}`}>
                                      <div className="projCard">
                                          <div
                                              className="imageContainer"
                                              style={{
                                                  backgroundImage: `url(${val.cover})`,
                                              }}
                                          >
                                              <h3>{val.title}</h3>
                                          </div>
                                      </div>
                                  </Link>
                              </Grid>
                          ))
                        : [
                              fillerProj,
                              fillerProj,
                              fillerProj,
                              fillerProj,
                              fillerProj,
                              fillerProj,
                              fillerProj,
                              fillerProj,
                          ].map((val, index) => (
                              <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={6}
                                  lg={4}
                                  xl={3}
                                  key={`Filler_${index}`}
                              >
                                  <div className=" projFiller">
                                      <CustomProgress />
                                  </div>
                              </Grid>
                          ))}
                </Grid>
            </div>
        </div>
    );
}

export default Home;
