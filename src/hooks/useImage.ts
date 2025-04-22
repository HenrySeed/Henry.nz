import src from "@emotion/styled";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useImage(url: string) {
    const [imageUrl, setImageUrl] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            user.getIdToken().then((idToken) => {
                fetch(url, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }).then(async (res) => {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                });
            });
        }
    }, [src, user]);

    return { url: imageUrl };
}
