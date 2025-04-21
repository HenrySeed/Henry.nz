import admin from "firebase-admin";
import atob from "atob";
import * as mediumToMarkdown from "medium-to-markdown";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../keys/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});

const projectsDB = admin.firestore().collection("projects");
const articlesDB = admin.firestore().collection("articles");
const demoURLMap = new Map();
const lastUpdatedMap = new Map();

/**
 * A callback for the HTTP request for a given GitHub Repo, adds it to the Body via innerHTML
 * @returns
 */
function scrapeGitHubRepo(responseText) {
    const responseObj = JSON.parse(responseText);
    if (!responseObj.content) {
        return;
    }

    const rawName = responseObj.git_url.split("/")[5];
    const camalCaseRegex = /[a-z][A-Z][a-z]/g;
    let title = rawName.replace(/-/g, " ").replace(/_/g, " ");
    if (title.match(camalCaseRegex)) {
        for (const match of title.match(camalCaseRegex) || []) {
            title = title.replace(match, match[0] + " " + match[1] + match[2]);
        }
    }
    title = title
        .split(" ")
        .map((val) => val[0].toUpperCase() + val.slice(1))
        .join(" ");

    const readmeMD = atob(responseObj.content.toString());

    const image_regex = /!\[.+\](.+)/g;
    const images = [];
    if (readmeMD.match(image_regex)) {
        for (const match of readmeMD.match(image_regex) || []) {
            images.push(match.split("(")[1].split(" ")[0].replace(")", ""));
        }
    }

    const readMeObj = {
        id: rawName,
        title: title,
        url: responseObj.html_url.split("/").slice(0, 5).join("/"),
        markdown: readmeMD,
        cover: images[0] || "",
        demoUrl: demoURLMap.get(rawName) || "",
        lastUpdated: lastUpdatedMap.get(rawName) || "2010-11-12T11:37:07Z", // default to a date before any other projects
    };

    projectsDB
        .doc(readMeObj.id)
        .set(readMeObj)
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

/**
 * Gets all repos from a profile and scrapes each one
 */
async function scrapeProfileRepos(responseText) {
    const responseObj = JSON.parse(responseText);

    if (responseObj?.message?.startsWith("API rate limit exceeded")) {
        console.log(
            `    Rate Limit reached for GitHub API, try again later. \n\nExiting...`
        );
    } else if (responseObj) {
        console.log(
            `    Loaded ${responseObj.length} Repos\n\nUploading new Versions...\n`
        );
        for (const repo of responseObj) {
            lastUpdatedMap.set(repo.name, repo.updated_at);
            demoURLMap.set(repo.name, repo.homepage);
            const request = await fetch(
                `https://api.github.com/repos/HenrySeed/${repo.name}/contents/README.md`
            );
            scrapeGitHubRepo(await request.text());
        }
        console.log(`    Done`);
    }
    console.log("\n\n\n\n");
}

/**
 * SCrapes a GitHub Profile
 */
async function scrapeGitHubProfile() {
    const request = await fetch("https://api.github.com/users/HenrySeed/repos");
    scrapeProfileRepos(await request.text());
}

/**
 * Scrapes a list of Medium articles
 */
function scrapeMedium() {
    console.log("Loading Medium Articles");
    const articles = [
        "https://medium.com/@henryseed/1473c784b8f0",
        "https://medium.com/@henryseed/796f29840fb4",
    ];
    for (const article of articles) {
        console.log(
            `Loading article ${article.replace(/.*medium\.com\//, "")}`
        );
        // Enter url here
        mediumToMarkdown
            .convertFromUrl(article)
            .then(function (markdown) {
                let cleaned = markdown.split("\n");
                // find the line of the first heading
                const firstHeading = cleaned.findIndex((line) =>
                    line.startsWith("=")
                );
                cleaned = cleaned.slice(firstHeading - 1);
                const title = cleaned[0];
                const id = cleaned[0]
                    .toLowerCase()
                    .replace(/[^A-z ]/g, "")
                    .replace(/ /g, "-");

                const firstImg = (
                    cleaned.find((line) => line.startsWith("![")) || ""
                )
                    .replace(/!\[(.*)\]\((.*)\)/g, "$1,$2")
                    .split(",");

                // remove the title and first image lines from the markdown
                cleaned = cleaned.slice(2);
                cleaned.splice(
                    cleaned.findIndex((line) => line.startsWith("![")),
                    1
                );

                const readMeObj = {
                    id,
                    title,
                    cover: {
                        src: firstImg[1],
                        caption: firstImg[0],
                    },
                    contents: cleaned.join("\n"),
                    draft: false,
                    genre: "",
                    date: { seconds: Date.now() / 1000 },
                    tags: [],
                };
                articlesDB
                    .doc(id)
                    .set(readMeObj)
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            })
            .catch((error) => console.error(error));
    }
}

async function main() {
    console.log("\n\n");
    console.log(
        `============= Updating Project pages for Henry.nz =============\n\nPlease Wait...\n`
    );
    await scrapeGitHubProfile();
    // scrapeMedium();
}

main();
