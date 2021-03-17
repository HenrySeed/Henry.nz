import "../views/App.css";
import "./Portfolio.css";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface Project {
    id: string;
    title: string;
    markdown: string;
    url: string;
    cover: string;
    demoUrl: string;
}

function Portfolio({ projects }: { projects: Project[] }) {
    const fillerProj = { id: "", title: "" };

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
        <Grid container spacing={5}>
            {projects.length > 0
                ? projects.map((val: Project) => (
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
    );
}

export default Portfolio;
