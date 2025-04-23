import { doc, getDoc } from "firebase/firestore/lite";
import { useState, useEffect, useCallback } from "react";
import { db } from "../components/firebase";
import { getErrorMsg } from "../utilities";

/**
 * A generic hook to fetch data from a firestore doc
 *
 * @export
 * @param {string} path
 * @param {{ skip?: boolean }} [options]
 * @return {*}
 */
export function useDoc(path: string, options?: { skip?: boolean }) {
    const [docData, setDocData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [refetchCounter, setRefetchCounter] = useState(0);

    useEffect(() => {
        if (options?.skip) {
            return;
        }
        setLoading(true);
        getDoc(doc(db, path))
            .then((snap) => {
                try {
                    if (snap) {
                        setDocData(snap.data());
                        setLoading(false);
                    }
                } catch (err) {
                    console.error(`[useDoc] Error: ${getErrorMsg(err)}`, err);
                    setError(getErrorMsg(err));
                }
            })
            .catch((err) => {
                console.error(`[useDoc] Error: ${getErrorMsg(err)}`, err);
                setError(getErrorMsg(err));
            });
    }, [path, refetchCounter, options?.skip]);

    const refetch = useCallback(() => {
        setRefetchCounter((prev) => prev + 1);
    }, []);

    return { doc: docData, loading, refetch, error };
}
