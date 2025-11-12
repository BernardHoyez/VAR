async function loadPage(page) {
  // Cas particulier : la page "randonnees_a_venir" est au format HTML
  const extension = page === "randonnees_a_venir" ? "html" : "md";
  const res = await fetch(`../content/${page}.${extension}`);
  const content = await res.text();

  // Si c’est du Markdown, on le convertit
  if (extension === "md") {
    document.getElementById("content").innerHTML = marked.parse(content);
  } else {
    document.getElementById("content").innerHTML = content;
  }
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});

window.addEventListener("load", () => loadPage("accueil"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
