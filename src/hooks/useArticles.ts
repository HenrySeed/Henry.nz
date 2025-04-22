import { useEffect, useState } from "react";
import { Article } from "../views/Home";
import { useDocs } from "./useDocs";

export function useArticles() {
    const { docs, loading, refetch } = useDocs("articles");
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        let artics: Article[] = docs.map((doc) => ({
            ...doc,
            type: "Article",
        }));

        // filter out draft articles
        artics = artics.filter((val) => val.draft !== true);

        // sort projects by last updated
        artics.sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0));

        setArticles(artics);
    }, [docs]);

    return { articles, loading, refetch };
}
