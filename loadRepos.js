const modals = [];

function modalShow(id) {
    document.getElementById(id).classList.remove("modalHidden");
    document.getElementById(id).classList.add("modalVisible");
    document.getElementById("modalScreen").style.display = "block";
    window.scroll(0, 0);
}

function modalHide(id) {
    document.getElementById(id).classList.remove("modalVisible");
    document.getElementById(id).classList.add("modalHidden");
    document.getElementById("modalScreen").style.display = "none";
}

function closeAllModals() {
    for (const modal of modals) {
        modalHide(modal);
    }
}

function getRepoReadme() {
    const responseObj = JSON.parse(this.responseText);
    if (!responseObj.content) {
        return;
    }
    const readmeMD = atob(responseObj.content.toString());
    const readmeHTML = marked(readmeMD);

    const image_regex = /!\[.+\](.+)/g;
    const images = [];
    if (readmeMD.match(image_regex)) {
        for (const match of readmeMD.match(image_regex)) {
            images.push(
                match
                    .split("(")[1]
                    .split(" ")[0]
                    .replace(")", "")
            );
        }
    }

    const rawName = responseObj.git_url.split("/")[5];
    const camalCaseRegex = /[a-z][A-Z][a-z]/g;
    let name = rawName.replace(/-/g, " ").replace(/_/g, " ");

    if (name.match(camalCaseRegex)) {
        for (const match of name.match(camalCaseRegex)) {
            name = name.replace(match, match[0] + " " + match[1] + match[2]);
        }
    }
    name = name
        .split(" ")
        .map(val => val[0].toUpperCase() + val.slice(1))
        .join(" ");

    if (images.length > 0) {
        const githubButton = `<a class="button" href="${responseObj.git_url}">GitHub</a>`;

        const expander = `<div class="projectTile" onclick="modalShow('${rawName}Modal')" style="background-image: url('${
            images[0]
        }')"><div class="title">${name}</div></div>`;

        document.getElementById("repos").innerHTML += expander;

        modals.push(`${rawName}Modal`);

        const modal = `<div class="modalHidden" id="${rawName}Modal"><span id="closeModal" onclick='modalHide("${rawName}Modal")'>&#xd7;</span>${githubButton}${readmeHTML}</div>`;
        document.getElementById("modalContainer").innerHTML += modal;
    }
}

function renderRepos() {
    const responseObj = JSON.parse(this.responseText);
    console.log(responseObj.message);
    const repos = responseObj.map(
        val =>
            `https://api.github.com/repos/HenrySeed/` +
            val.name +
            "/contents/README.md"
    );

    for (const repo of repos) {
        var request = new XMLHttpRequest();
        request.onload = getRepoReadme;
        request.open("get", repo, true);
        request.send();
    }
}

function main() {
    var request = new XMLHttpRequest();
    request.onload = renderRepos;
    request.open("get", "https://api.github.com/users/HenrySeed/repos", true);
    request.send();
}
