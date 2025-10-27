const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const ORG = "MoneyGodONE";
const REPO = "MGO";
const FRONTEND_PATH = path.join(__dirname, "frontend", "index.html");

async function fetchReadme() {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${ORG}/${REPO}/main/README.md`);
    if (!res.ok) return "README not found.";
    return await res.text();
  } catch (err) {
    return "Failed to load README.";
  }
}

async function fetchRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${ORG}/repos?per_page=100`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

function generateHTML(readmeText, repos) {
  repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  const repoCards = repos.map(r => `
    <div class="repo-card">
      <a href="${r.html_url}">${r.name}</a>
      <p>${r.description || "No description provided."}</p>
      <p>⭐ ${r.stargazers_count} | 🍴 ${r.forks_count}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoneyGod.ONE Ecosystem</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; }
    .repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .repo-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .repo-card a { font-weight: bold; color: #007bff; text-decoration: none; }
    .repo-card a:hover { text-decoration: underline; }
    .repo-card p { margin: 5px 0; }
    pre { white-space: pre-wrap; } /* For raw README text */
  </style>
</head>
<body>
  <div class="container">
    <h1>MoneyGod.ONE Ecosystem</h1>
    <p>Explore the open-source projects powering the MoneyGod.ONE network</p>

    <h2>📘 NOTE (from MGO README)</h2>
    <pre>${readmeText}</pre>

    <h2>💎 Available Catalogues / Projects</h2>
    <div class="repo-grid">
      ${repoCards}
    </div>
  </div>
</body>
</html>`;
}

async function buildLandingPage() {
  console.log("🔄 Generating landing page...");
  const [readmeText, repos] = await Promise.all([fetchReadme(), fetchRepos()]);
  // Ensure folder exists
  fs.mkdirSync(path.join(__dirname, "frontend"), { recursive: true });
  // Write HTML
  fs.writeFileSync(FRONTEND_PATH, generateHTML(readmeText, repos), "utf8");
  console.log(`✅ Landing page generated at ${FRONTEND_PATH}`);
}

// Build once
buildLandingPage();
