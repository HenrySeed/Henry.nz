import { useState, useEffect } from "react";
import { getErrorMsg, getImagePaths, imageHostingUrl } from "../utilities";
import { useAuthContext } from "./AuthContext";

export function useImage(path: string, variant?: "thumb" | "large" | "full") {
    const { user } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [blobUrl, setBlobUrl] = useState("");
    const [blurhash, setBlurHash] = useState("");
    const [imageRatio, setImageRatio] = useState(0);

    useEffect(() => {
        if (user) {
            console.log(`[useImage] Loading image blob for: "${path}"`);
            const variants = getImagePaths(path);
            const correctPath = variant ? variants[variant] : path;

            user.getIdToken().then((idToken) => {
                // fetch a blurhash algorithm

                // console.log(`Fetching blurhash`);
                fetch(imageHostingUrl + "/blurhash/" + variants.fileName, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                })
                    .then(async (res) => {
                        res.json()
                            .then((val) => {
                                console.log(`BLURHASH: ${val}`);
                                const { blurhash, width, height } = val;
                                setBlurHash(blurhash);
                                setImageRatio(width / height);
                            })
                            .catch((err) => {
                                setLoading(false);
                                console.error(
                                    `[useImage] Error: ${getErrorMsg(err)}`,
                                    err
                                );
                            });
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.error(
                            `[useImage] Error: ${getErrorMsg(err)}`,
                            err
                        );
                    });

                // Fetch the image blob
                fetch(imageHostingUrl + correctPath, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                })
                    .then(async (res) => {
                        res.blob().then((blob) => {
                            const newBlobUrl = URL.createObjectURL(blob);
                            setBlobUrl(newBlobUrl);
                            setLoading(false);
                            console.log(`[useImage] Loaded`);
                        });
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
    }, [user, path, variant]);

    return { blobUrl, blurhash, loading, imageRatio };
}
