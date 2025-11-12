async function loadPage(page) {
  const basePath = `../content/${page}`;
  let content = "";
  let found = false;

  // Essai du .md
  try {
    const res = await fetch(`${basePath}.md`);
    if (res.ok) {
      const md = await res.text();
      content = marked.parse(md);
      found = true;
    }
  } catch (e) {}

  // Sinon essai du .html
  if (!found) {
    try {
      const res = await fetch(`${basePath}.html`);
      if (res.ok) {
        content = await res.text();
        found = true;
      }
    } catch (e) {}
  }

  // Affiche le contenu ou message d’erreur
  const target = document.getElementById("content");
  target.innerHTML = found
    ? content
    : "<p style='color:red;'>Page introuvable.</p>";

  // 👉 Après affichage, si c’est la page galerie, initialise le carrousel
  if (page === "galerie") initCarousel();
}

// Initialisation du carrousel si présent
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return; // pas de carrousel ici

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextButton.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  });
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => loadPage(btn.dataset.page));
});

window.addEventListener("load", () => loadPage("accueil"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
