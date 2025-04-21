import {
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { Button, CircularProgress } from "@mui/material";
import { VerifiedUser, Logout } from "@mui/icons-material";
import { useState } from "react";

export function SignInButton() {
    const { user } = useAuth();
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
            >
                Sign in
            </Button>
        );
    }
}
