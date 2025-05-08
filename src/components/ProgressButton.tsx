import { Button, ButtonProps, CircularProgress } from "@mui/material";

export function ProgressButton({
    showProgress,
    ...buttonProps
}: { showProgress: boolean } & ButtonProps) {
    return (
        <Button
            {...buttonProps}
            startIcon={
                showProgress ? (
                    <CircularProgress
                        sx={{
                            width: "20px !important",
                            height: "20px !important",
                        }}
                    />
                ) : (
                    buttonProps.startIcon ?? undefined
                )
            }
        />
    );
}
