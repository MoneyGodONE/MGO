const fetch = require('node-fetch');
const fs = require('fs');

async function generateHTML() {
  const org = "MoneyGodONE";
  const url = `https://api.github.com/orgs/${org}/repos?per_page=100`;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.error("Error fetching repos:", resp.status, resp.statusText);
    return;
  }
  const repos = await resp.json();
  
  // Sort by name or by updated date if you want
  repos.sort((a, b) => a.name.localeCompare(b.name));
  
  const htmlLines = [];
  htmlLines.push(`<!DOCTYPE html>`);
  htmlLines.push(`<html lang="en">`);
  htmlLines.push(`<head><meta charset="utf-8"><title>${org} — Repositories</title></head>`);
  htmlLines.push(`<body>`);
  htmlLines.push(`<h1>${org} — Public Repositories</h1>`);
  htmlLines.push(`<ul>`);
  for (const repo of repos) {
    htmlLines.push(
      `  <li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`
    );
  }
  htmlLines.push(`</ul>`);
  htmlLines.push(`</body></html>`);
  
  fs.writeFileSync("repos.html", htmlLines.join("\n"));
  console.log("Generated repos.html with", repos.length, "repos.");
}

generateHTML().catch(console.error);
