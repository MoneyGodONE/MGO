const fs = require('fs');
const fetch = require('node-fetch');

async function generateLandingPage() {
  const org = "MoneyGodONE";
  const repo = "MGO";

  // 1️⃣ Get README from MGO
  const readmeResp = await fetch(`https://raw.githubusercontent.com/${org}/${repo}/main/README.md`);
  const readmeText = readmeResp.ok ? await readmeResp.text() : "README not found.";

  // 2️⃣ Get all repositories
  const reposResp = await fetch(`https://api.github.com/users/${org}/repos?per_page=100`);
  if (!reposResp.ok) {
    console.error("Error fetching repos:", reposResp.status, reposResp.statusText);
    return;
  }
  const repos = await reposResp.json();
  repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // newest first

  // 3️⃣ Build HTML
  const repoCards = repos.map(r => `
    <div class="card">
      <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
      <p>${r.description || "No description provided."}</p>
      <p class="meta">⭐ ${r.stargazers_count} | 🍴 ${r.forks_count}</p>
    </div>
  `).join('');

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${org} — Ecosystem</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: #0b0f17;
        color: #fff;
        margin: 0;
        padding: 0;
      }
      header {
        background: linear-gradient(90deg, #0077ff, #00ffaa);
        padding: 30px;
        text-align: center;
        color: #000;
      }
      h1 { margin: 0; font-size: 2.5em; }
      section {
        padding: 30px;
        max-width: 1200px;
        margin: auto;
      }
      .note {
        background: #111;
        border: 1px solid #333;
        padding: 20px;
        border-radius: 8px;
        white-space: pre-wrap;
        overflow-x: auto;
      }
      .catalog {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      .card {
        background: #1b1f2a;
        border: 1px solid #333;
        padding: 20px;
        border-radius: 10px;
        transition: 0.2s ease;
      }
      .card:hover {
        transform: scale(1.03);
        background: #22283a;
      }
      .card a {
        color: #00ffaa;
        text-decoration: none;
      }
      .meta {
        color: #999;
        font-size: 0.9em;
      }
      footer {
        text-align: center;
        padding: 20px;
        color: #666;
        border-top: 1px solid #222;
        margin-top: 50px;
      }
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
      © ${new Date().getFullYear()} MoneyGod.ONE | Built automatically via NodeHTMLbuilder.js
    </footer>
  </body>
  </html>
  `;

  // 4️⃣ Save HTML file
  fs.mkdirSync('./frontend', { recursive: true });
  fs.writeFileSync('./frontend/index.html', html, 'utf8');
  console.log(`✅ Landing page g
