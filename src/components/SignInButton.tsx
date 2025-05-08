import {
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { VerifiedUser, Logout } from "@mui/icons-material";
import { useState } from "react";
import { useAuthContext } from "../hooks/AuthContext";

export function SignInButton(props: ButtonProps) {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    if (user) {
        return (
            <Button
                disabled={loading}
                variant="outlined"
                onClick={() => {
                    const auth = getAuth();
                    signOut(auth);
                }}
                startIcon={
                    loading ? (
                        <CircularProgress
                            sx={{
                                width: "20px !important",
                                height: "20px !important",
                            }}
                        />
                    ) : (
                        <Logout />
                    )
                }
                {...props}
            >
                Sign Out
            </Button>
        );
    } else {
        return (
            <Button
                disabled={loading}
                variant="outlined"
                startIcon={
                    loading ? (
                        <CircularProgress
                            sx={{
                                width: "20px !important",
                                height: "20px !important",
                            }}
                        />
                    ) : (
                        <VerifiedUser />
                    )
                }
                onClick={async () => {
                    setLoading(true);

                    const provider = new GoogleAuthProvider();
                    const auth = getAuth();
                    await signInWithPopup(auth, provider);

                    setLoading(false);
                }}
                {...props}
            >
                Sign in
            </Button>
        );
    }
}
