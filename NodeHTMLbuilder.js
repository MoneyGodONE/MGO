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
    <div class="card">
      <a href="${r.html_url}" target="_blank">${r.name}</a>
      <p>${r.description || "No description provided."}</p>
      <p class="meta">⭐ ${r.stargazers_count} | 🍴 ${r.forks_count}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MoneyGod.ONE Ecosystem</title>
<style>
  body { margin:0; font-family: 'Segoe UI', sans-serif; background:#0b0f17; color:#fff; }
  header { background: linear-gradient(90deg,#0077ff,#00ffaa); padding:40px 20px; text-align:center; color:#000; }
  header h1 { margin:0; font-size:2.5em; }
  header p { margin:10px 0 0 0; font-size:1.2em; color:#111; }
  section { padding:40px 20px; max-width:1200px; margin:auto; }
  h2 { margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:10px; }
  .note { background:#111; border:1px solid #333; padding:20px; border-radius:8px; white-space:pre-wrap; overflow-x:auto; max-height:300px; }
  .catalog { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; margin-top:30px; }
  .card { background:#1b1f2a; border:1px solid #333; padding:20px; border-radius:10px; transition:.2s ease; }
  .card:hover { transform:scale(1.03); background:#22283a; }
  .card a { color:#00ffaa; text-decoration:none; font-size:1.2em; }
  .card p { margin:10px 0 0 0; font-size:0.95em; }
  .meta { color:#999; font-size:.85em; margin-top:10px; }
  footer { text-align:center; padding:20px; color:#666; border-top:1px solid #222; margin-top:50px; }
</style>
</head>
<body>
<header>
  <h1>MoneyGod.ONE Ecosystem</h1>
  <p>Explore the open-source projects powering the MoneyGod.ONE network</p>
</header>

<section>
  <h2>📘 NOTE (from MGO README)</h2>
  <div class="note" id="readme">Loading README...</div>

  <h2>💎 Available Catalogues / Projects</h2>
  <div class="catalog" id="repos">Loading projects...</div>
</section>

<footer>
  © <span id="year"></span> MoneyGod.ONE | Auto-updated daily
</footer>

<script>
const USER = "MoneyGodONE";
const REPO = "MGO";

// Set the current year
document.getElementById("year").textContent = new Date().getFullYear();

// Fetch README
fetch(`https://api.github.com/repos/${USER}/${REPO}/readme`)
  .then(response => response.json())
  .then(data => {
    const content = atob(data.content.replace(/\n/g, ''));
    document.getElementById("readme").innerText = content;
  })
  .catch(error => {
    document.getElementById("readme").innerText = "Failed to load README: " + error.message;
  });

// Fetch repositories
fetch(`https://api.github.com/users/${USER}/repos`)
  .then(response => response.json())
  .then(repos => {
    const catalog = document.getElementById("repos");
    catalog.innerHTML = '';
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || 'No description available'}</p>
        <div class="meta">⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | Updated: ${new Date(repo.updated_at).toLocaleDateString()}</div>
      `;
      catalog.appendChild(card);
    });
  })
  .catch(error => {
    document.getElementById("repos").innerText = "Failed to load projects: " + error.message;
  });
</script>
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
