import { LinearProgress, withStyles } from "@material-ui/core";

export const CustomProgress = withStyles((theme) => ({
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
