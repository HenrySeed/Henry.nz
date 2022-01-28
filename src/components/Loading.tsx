import {
    CircularProgress,
    LinearProgress,
    withStyles,
} from "@material-ui/core";

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

const CustomCircularProgress = withStyles((theme) => ({
    root: {
        height: 3,
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    colorPrimary: {
        color: "white",
    },
}))(CircularProgress);

export function CenteredCircular() {
    return (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <CustomCircularProgress />
        </div>
    );
}
