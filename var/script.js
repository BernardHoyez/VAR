const markdownContainer = document.getElementById("markdown-container");

async function loadMarkdown() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/BernardHoyez/VAR/refs/heads/main/randos.md");
    if (!response.ok) throw new Error("Erreur de chargement du fichier.");
    const markdown = await response.text();
    markdownContainer.innerHTML = marked.parse(markdown);
  } catch (error) {
    markdownContainer.innerHTML = `<p style="color:red;">Impossible de charger le tableau des randonnées.</p>`;
  }
}

loadMarkdown();

// PWA : installation du service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
