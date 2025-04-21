import { useEffect, useState } from "react";
import { Project } from "../views/Home";
import { useDocs } from "./useDocs";

const npmProjects = [
    {
        id: "ASCII-WorldMap-NPM",
        url: "https://www.npmjs.com/package/ascii-worldmap",
    },
    {
        id: "react-screenshot-frame",
        url: "https://www.npmjs.com/package/react-window-frame",
    },
];

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const { loading, docs } = useDocs("projects");

    useEffect(() => {
        let projs: Project[] = docs.map((doc) => ({
            ...doc,
            npmURL: npmProjects.find((val) => val.id === doc.id)?.url || "",
            type: "Project",
        }));

        // filter out certain projects
        const blackList = ["HenrySeed", "Henry.nz"];
        projs = projs.filter(
            (proj) => proj.cover !== "" && !blackList.includes(proj.id)
        );

        // sort projects by last updated
        projs.sort((a, b) =>
            b.lastUpdated < a.lastUpdated
                ? -1
                : b.lastUpdated > a.lastUpdated
                ? 1
                : 0
        );

        setProjects(projs);
    }, [docs]);

    return { projects, loading };
}
