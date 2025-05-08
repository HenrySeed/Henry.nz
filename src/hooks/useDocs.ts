import { collection, getDocs } from "firebase/firestore/lite";
import { useState, useEffect, useCallback } from "react";
import { db } from "../components/firebase";
import { getErrorMsg } from "../utilities";
import { useAuthContext } from "./AuthContext";

/**
 * A generic hook to fetch data from a firestore collection of docs
 *
 * @export
 * @param {string} collectionName
 * @param {{ skip?: boolean }} [options]
 * @return {*}
 */
export function useDocs<T = any>(
    collectionName: string,
    options?: { skip?: boolean; ignoreUserCheck?: boolean }
) {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refetchCounter, setRefetchCounter] = useState(0);
    const [error, setError] = useState<string | undefined>(undefined);
    const { user } = useAuthContext();

    useEffect(() => {
        if (options?.skip || (!options?.ignoreUserCheck && !user)) {
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
                    console.error(`[useDocs] Error: ${getErrorMsg(err)}`, err);
                    setError(getErrorMsg(err));
                }
            })
            .catch((err) => {
                console.error(`[useDoc] Error: ${getErrorMsg(err)}`, err);
                setError(err);
            });
    }, [
        user,
        collectionName,
        refetchCounter,
        options?.skip,
        options?.ignoreUserCheck,
    ]);

    const refetch = useCallback(() => {
        setRefetchCounter((prev) => prev + 1);
    }, []);

    return { docs: docs as T[], loading, refetch, error };
}
