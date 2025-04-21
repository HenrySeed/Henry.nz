export interface TimelineItem {
    text: string;
    createdMs: number;
}

export interface BlogPost {
    type: "Text Post" | "Timeline Post";
    id: string;
    title: string;
    content: string;
    created: Date;
    updated: Date;
    tags: string[];
    deleted: boolean;
}
