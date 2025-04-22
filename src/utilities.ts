export function shuffle(array: any[]) {
    var currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals: [number, string][] = [
        [60 * 60 * 24 * 365, "year"],
        [60 * 60 * 24 * 30, "month"],
        [60 * 60 * 24 * 7, "week"],
        [60 * 60 * 24, "day"],
        [60 * 60, "hour"],
        [60, "minute"],
        [1, "second"],
    ];

    for (const [secs, label] of intervals) {
        const count = Math.floor(seconds / secs);
        if (count >= 1) return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
    }

    return "just now";
}

export function getImagepaths(url: string) {
    const baseUrl = url.replace(
        /(?:-thumb)|(?:-large)(\.[a-zA-Z]{1,5})/g,
        "$1"
    );
    const noExt = baseUrl.replace(/\.[A-Za-z]{1,5}/g, "");
    const ext = baseUrl.match(/\.[A-Za-z]{1,5}/g)?.[0];

    return {
        thumb: `${noExt}-thumb${ext}`,
        large: `${noExt}-large${ext}`,
        full: baseUrl,
    };
}
