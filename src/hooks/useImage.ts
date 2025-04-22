import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useImage(url: string) {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            user.getIdToken().then((idToken) => {
                fetch(url, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                })
                    .then(async (res) => {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        setImageUrl(url);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
            });
        }
    }, [user, url]);

    return { url: imageUrl, loading };
}
