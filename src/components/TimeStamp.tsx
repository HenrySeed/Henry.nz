import { Tooltip, TooltipProps, Typography } from "@mui/material";
import { timeAgo } from "../utilities";
import { AccessTime } from "@mui/icons-material";

/**
 * A simple component to show timeAgo (eg: "x days ago") information
 * with a hover tooltip showing the full time and date
 *
 * @export
 * @param {({ date: Date } & Omit<TooltipProps, "title" | "children">)}
 * @return {*}
 */
export function TimeStamp({
    date,
    ...props
}: { date: Date } & Omit<TooltipProps, "title" | "children">) {
    return (
        <Tooltip title={date.toLocaleString()} placement="top" {...props}>
            <Typography
                variant="body2"
                sx={{ opacity: 0.7, width: "fit-content" }}
            >
                <AccessTime
                    sx={{
                        fontSize: "11pt",
                        marginBottom: "-2px",
                        marginRight: "4px",
                    }}
                />

                {timeAgo(date.getTime())}
            </Typography>
        </Tooltip>
    );
}
