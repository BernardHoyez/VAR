async function loadPage(page) {
  const res = await fetch(`../content/${page}.md`);
  const md = await res.text();
  document.getElementById("content").innerHTML = marked.parse(md);
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});

window.addEventListener("load", () => loadPage("accueil"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
