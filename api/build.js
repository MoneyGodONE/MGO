import fetch from 'node-fetch';

export default async function handler(req, res) {
  const org = "MoneyGodONE";
  const repo = "MGO";

  const readme = await fetch(`https://raw.githubusercontent.com/${org}/${repo}/main/README.md`).then(r => r.text());
  const repos = await fetch(`https://api.github.com/users/${org}/repos?per_page=100`).then(r => r.json());

  const repoList = repos.map(r => `<li><a href="${r.html_url}">${r.name}</a></li>`).join('');

  const html = `
    <html><body>
      <h1>${org} Ecosystem</h1>
      <pre>${readme}</pre>
      <ul>${repoList}</ul>
    </body></html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
