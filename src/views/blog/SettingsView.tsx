import { Button, Stack, TextField, Typography } from "@mui/material";
import { CenteredProgress } from "../../components/Loading";
import { useDocs } from "../../hooks/useDocs";
import { ProgressButton } from "../../components/ProgressButton";
import { ArrowBackIos, Delete, Save } from "@mui/icons-material";
import { SignInButton } from "../../components/SignInButton";
import { useState } from "react";
import { setDoc, doc, deleteDoc } from "firebase/firestore/lite";
import { db } from "../../components/firebase";
import { getErrorMsg } from "../../utilities";
import { useNavigate } from "react-router";

export interface BlogUser {
    email: string;
    role: "viewer" | "admin";
}

export function SettingsView() {
    const { docs: blogUsers, loading, refetch } = useDocs<BlogUser>("users");
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeletingEmail, setIsDeletingEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");

    async function addUser() {
        setIsSaving(true);
        await setDoc(doc(db, "users", newEmail), {
            email: newEmail,
            role: "viewer",
        }).catch((err) =>
            console.error(
                `[SettingsView] addUser Error ${getErrorMsg(err)}`,
                err
            )
        );
        setNewEmail("");
        setIsSaving(false);
        refetch();
    }
    async function deleteUser(email: string) {
        setIsDeletingEmail(email);
        await deleteDoc(doc(db, "users", email)).catch((err) =>
            console.error(
                `[SettingsView] deleteUser Error ${getErrorMsg(err)}`,
                err
            )
        );
        setIsDeletingEmail("");
        refetch();
    }

    return (
        <div className="projWrapper" style={{ overflowX: "visible" }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ marginBottom: "20px" }}
            >
                <Button
                    onClick={() => navigate("/blog")}
                    startIcon={<ArrowBackIos />}
                >
                    All Posts
                </Button>
            </Stack>

            <h1>Settings</h1>

            {loading ? (
                <CenteredProgress />
            ) : (
                <Stack spacing={2}>
                    <Stack
                        sx={{ paddingY: "30px" }}
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                    >
                        <TextField
                            onChange={(e) => setNewEmail(e.target.value)}
                            value={newEmail}
                            fullWidth
                            label="New User"
                        />
                        <ProgressButton
                            showProgress={isSaving}
                            variant="outlined"
                            startIcon={<Save />}
                            sx={{ width: "120px" }}
                            onClick={() => addUser()}
                        >
                            Save
                        </ProgressButton>
                    </Stack>
                    {blogUsers.map((blogUser) => (
                        <Stack
                            key={blogUser.email}
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                        >
                            <Stack direction="row" spacing={2}>
                                <Typography>{blogUser.email}</Typography>
                                <Typography sx={{ opacity: 0.5 }}>
                                    {blogUser.role}
                                </Typography>
                            </Stack>
                            <ProgressButton
                                showProgress={
                                    isDeletingEmail === blogUser.email
                                }
                                color="info"
                                startIcon={<Delete />}
                                disabled={blogUser.role === "admin"}
                                onClick={() => deleteUser(blogUser.email)}
                            >
                                Delete
                            </ProgressButton>
                        </Stack>
                    ))}
                </Stack>
            )}
        </div>
    );
}
