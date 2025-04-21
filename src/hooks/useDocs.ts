import { collection, getDocs } from "firebase/firestore/lite";
import { useState, useEffect, useCallback } from "react";
import { db } from "../components/firebase";

/**
 * A generic hook to fetch data from a firestore collection of docs
 *
 * @export
 * @param {string} collectionName
 * @param {{ skip?: boolean }} [options]
 * @return {*}
 */
export function useDocs(collectionName: string, options?: { skip?: boolean }) {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refetchCounter, setRefetchCounter] = useState(0);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (options?.skip) {
            return;
        }
        setLoading(true);
        getDocs(collection(db, collectionName))
            .then((snap) => {
                try {
                    if (snap) {
                        const docDatas: any[] = [];
                        snap.forEach((doc) => {
                            docDatas.push(doc.data());
                        });
                        setDocs(docDatas);
                        setLoading(false);
                    }
                } catch (err) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : JSON.stringify(err);
                    setError(message);
                }
            })
            .catch((e) => setError(e));
    }, [refetchCounter, options]);

    const refetch = useCallback(() => {
        setRefetchCounter((prev) => prev + 1);
    }, []);

    return { docs, loading, refetch, error };
}
