// NodeHTMLbuilder.js
import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Helpers for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORG = "MoneyGodONE";
const REPO = "MGO";
const FRONTEND_PATH = path.join(__dirname, "public", "index.html"); 
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // daily

// Fetch README from GitHub
async function fetchReadme() {
  const url = `https://raw.githubusercontent.com/${ORG}/${REPO}/main/README.md`;
  const res = await fetch(url);
  if (!res.ok) return "README not found.";
  return await res.text();
}

// Fetch all public repos
async function fetchRepos() {
  const url = `https://api.github.com/users/${ORG}/repos?per_page=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return await res.json();
}

// Hash to detect changes
function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// Generate final HTML
function generateHTML(readmeText, repos) {
  repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  const repoCards = repos.map(r => `
    <div class="card">
      <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
      <p>${r.description || "No description provided."}</p>
      <p class="meta">⭐ ${r.stargazers_count} | 🍴 ${r.forks_count}</p>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${ORG} — Ecosystem</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family:'Segoe UI',sans-serif; background:#0b0f17; color:#fff; margin:0; padding:0; }
      header { background: linear-gradient(90deg,#0077ff,#00ffaa); padding:30px; text-align:center; color:#000; }
      h1 { margin:0; font-size:2.5em; }
      section { padding:30px; max-width:1200px; margin:auto; }
      .note { background:#111; border:1px solid #333; padding:20px; border-radius:8px; white-space:pre-wrap; overflow-x:auto; }
      .catalog { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; margin-top:30px; }
      .card { background:#1b1f2a; border:1px solid #333; padding:20px; border-radius:10px; transition:.2s ease; }
      .card:hover { transform:scale(1.03); background:#22283a; }
      .card a { color:#00ffaa; text-decoration:none; }
      .meta { color:#999; font-size:.9em; }
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
      <div class="note">${readmeText}</div>

      <h2>💎 Available Catalogues / Projects</h2>
      <div class="catalog">
        ${repoCards}
      </div>
    </section>

    <footer>
      © ${new Date().getFullYear()} MoneyGod.ONE | Auto-updated daily
    </footer>
  </body>
  </html>
  `;
}

// Main builder function
async function buildLandingPage() {
  try {
    console.log("🔄 Checking for updates...");
    const [readmeText, repos] = await Promise.all([fetchReadme(), fetchRepos()]);
    const html = generateHTML(readmeText, repos);

    const newHash = hashContent(html);
    const oldHash = fs.existsSync(FRONTEND_PATH)
      ? hashContent(fs.readFileSync(FRONTEND_PATH, "utf8"))
      : null;

    if (newHash !== oldHash) {
      fs.mkdirSync(path.dirname(FRONTEND_PATH), { recursive: true });
      fs.writeFileSync(FRONTEND_PATH, html, 'utf8');
      console.log(`✅ Updated ${FRONTEND_PATH} with ${repos.length} repos.`);
    } else {
      console.log("✅ No changes detected. Page is up to date.");
    }
  } catch (err) {
    console.error("❌ Error generating landing page:", err.message);
  }
}

// Run once now
buildLandingPage();

// Optional: auto-run every 24h (only if running continuously)
setInterval(buildLandingPage, REFRESH_INTERVAL);
