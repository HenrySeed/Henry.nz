import { getDocs, collection } from "firebase/firestore/lite";
import { useState, useEffect, useCallback } from "react";
import { db } from "../components/firebase";
import { BlogPost } from "../types";
import { useDocs } from "./useDocs";

export function useBlogPosts() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const { loading, docs, refetch } = useDocs("blogPosts");

    useEffect(() => {
        console.log("[blog] Loading BlogPosts");
        const posts: BlogPost[] = docs.map((doc) => ({
            ...doc,
            deleted: doc.deleted ?? false,
            created: new Date(doc.created),
            updated: new Date(doc.updated),
        }));

        // sort posts by updated
        posts.sort((a, b) => b.updated.getTime() - a.updated.getTime());

        // filter out deleted
        const activePosts = posts.filter((post) => !post.deleted);

        setBlogPosts(activePosts);
    }, [docs]);

    return { blogPosts, loading, refetch };
}
