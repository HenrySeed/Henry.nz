import { useState, useEffect } from "react";
import { BlogPost } from "../types";
import { useDoc } from "./useDoc";

export function useBlogPost(id: string | undefined) {
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const { doc, loading, refetch } = useDoc(`blogPosts/${id}`, {
        skip: id === "new",
    });

    useEffect(() => {
        console.log("[blog] Loading BlogPosts", { id });
        if (doc) {
            setBlogPost({
                ...doc,
                deleted: doc.deleted ?? false,
                created: new Date(doc.created),
                updated: new Date(doc.updated),
            });
        }
    }, [doc]);

    return { blogPost, loading, refetch };
}
