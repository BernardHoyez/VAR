async function loadPage(page) {
  const basePath = `../content/${page}`;
  let content = "";
  let found = false;

  // On essaie d'abord le fichier .md
  try {
    const res = await fetch(`${basePath}.md`);
    if (res.ok) {
      const md = await res.text();
      content = marked.parse(md);
      found = true;
    }
  } catch (e) {}

  // Si le .md n’existe pas, on tente le .html
  if (!found) {
    try {
      const res = await fetch(`${basePath}.html`);
      if (res.ok) {
        content = await res.text();
        found = true;
      }
    } catch (e) {}
  }

  // Affichage du contenu ou message d’erreur
  const target = document.getElementById("content");
  target.innerHTML = found
    ? content
    : "<p style='color:red;'>Page introuvable.</p>";
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});

window.addEventListener("load", () => loadPage("accueil"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
