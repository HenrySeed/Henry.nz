const admin = require("firebase-admin");
const serviceAccount = require("../keys/henrynz-firebase-adminsdk-jzw87-5b7cf4e917.json");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var atob = require("atob");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});

const firestore = admin.firestore().collection("projects");
const demoURLMap = new Map();
const lastUpdatedMap = new Map();

/**
 * A callback for the HTTP request for a given GitHub Repo, adds it to the Body via innerHTML
 * @returns
 */
function getRepoReadme(demoURL) {
    const responseObj = JSON.parse(this.responseText);
    if (!responseObj.content) {
        return;
    }

    const rawName = responseObj.git_url.split("/")[5];
    const camalCaseRegex = /[a-z][A-Z][a-z]/g;
    let title = rawName.replace(/-/g, " ").replace(/_/g, " ");
    if (title.match(camalCaseRegex)) {
        for (const match of title.match(camalCaseRegex)) {
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
        for (const match of readmeMD.match(image_regex)) {
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

    firestore
        .doc(readMeObj.id)
        .set(readMeObj)
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

/**
 * Displays all given repos from Github
 */
function renderRepos() {
    const responseObj = JSON.parse(this.responseText);

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
            const readmeURL = `https://api.github.com/repos/HenrySeed/${repo.name}/contents/README.md`;
            demoURLMap.set(repo.name, repo.homepage);
            var request = new XMLHttpRequest();
            request.onload = getRepoReadme;
            request.open("get", readmeURL, true);
            request.send();
        }
        console.log(`    Done`);
    }
    console.log("\n\n\n\n");
}

console.log("\n\n\n\n");
console.log(
    `============= Updating Project pages for Henry.nz =============\n\nPlease Wait...\n`
);
var request = new XMLHttpRequest();
request.onload = renderRepos;
request.open("get", "https://api.github.com/users/HenrySeed/repos", true);
request.send();
