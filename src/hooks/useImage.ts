import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getErrorMsg, getImagePaths } from "../utilities";

export function useImage(url: string, variant?: "thumb" | "large" | "full") {
    const [blobUrl, setBlobUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            console.log(`[useImage] Loading image blob for: "${url}"`);
            const correctUrl = variant ? getImagePaths(url)[variant] : url;

            user.getIdToken().then((idToken) => {
                fetch(correctUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                })
                    .then(async (res) => {
                        const blob = await res.blob();
                        const newBlobUrl = URL.createObjectURL(blob);
                        setBlobUrl(newBlobUrl);
                        setLoading(false);
                        console.log(`[useImage] Loaded`);
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.error(
                            `[useImage] Error: ${getErrorMsg(err)}`,
                            err
                        );
                    });
            });
        }
    }, [user, url, variant]);

    return { blobUrl, loading };
}
