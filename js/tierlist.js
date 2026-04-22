// ------------------------------------------------------------
// 1) Configuration des tiers
// ------------------------------------------------------------
const TIERS = ["S", "A", "B", "C", "EW"];

// ------------------------------------------------------------
// 2) Création de la structure du tableau
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tier-list");
  if (!container) return;

  TIERS.forEach(tierName => {
    const row = createTierRow(tierName);
    container.appendChild(row);
  });

  setupTierDropZones();
  setupShareButton();
});

// ------------------------------------------------------------
// 3) Création d'une rangée (S, A, B, C, EW)
// ------------------------------------------------------------
function createTierRow(name) {
  const row = document.createElement("div");
  row.classList.add("tier-row", `tier-${name}`);

  const title = document.createElement("h2");
  title.textContent = name;
  title.contentEditable = true;

  // Empêche qu'on drop sur le titre
  title.addEventListener("dragover", e => e.preventDefault());
  title.addEventListener("drop", e => e.preventDefault());

  const cards = document.createElement("div");
  cards.classList.add("tier-cards");

  row.appendChild(title);
  row.appendChild(cards);

  return row;
}

// ------------------------------------------------------------
// 4) Gestion du drag & drop dans les zones de tier
// ------------------------------------------------------------
function setupTierDropZones() {
  const zones = document.querySelectorAll(".tier-cards");

  zones.forEach(zone => {
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedCard = document.getElementById(draggedId);
      if (!draggedCard) return;

      const afterElement = getDragAfterElement(zone, e.clientX);

      if (!afterElement) {
        zone.appendChild(draggedCard);
      } else {
        zone.insertBefore(draggedCard, afterElement);
      }
    });

    zone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedCard = document.getElementById(draggedId);
      if (!draggedCard) return;

      const afterElement = getDragAfterElement(zone, e.clientX);

      if (!afterElement) {
        zone.appendChild(draggedCard);
      } else {
        zone.insertBefore(draggedCard, afterElement);
      }
    });
  });
}

// Trouve la carte la plus proche pour insérer avant/après
function getDragAfterElement(container, x) {
  const cards = [...container.querySelectorAll(".map-card:not(.dragging)")];

  return cards.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - (box.left + box.width / 2);

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// ------------------------------------------------------------
// 5) BOUTON SHARE (remplace totalement DOWNLOAD)
// ------------------------------------------------------------
function setupShareButton() {
  const btn = document.getElementById("capture-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    // Vérifier si connecté
    const auth = await fetch("http://localhost/api/me.php", { credentials: "include" })
      .then(r => r.json());

    if (!auth.authenticated) {
      alert("You need to log in to share your tierlist on the website.");
      return;
    }

    // Capture de la tierlist
    const element = document.getElementById("tier-list");
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null
    });

    const imageData = canvas.toDataURL("image/png");

    // Déterminer le type selon la page
    let type = null;
    if (document.body.classList.contains("page-maps")) type = "map";
    if (document.body.classList.contains("page-bows")) type = "bow";
    if (document.body.classList.contains("page-arrows")) type = "arrow";
    if (document.body.classList.contains("page-skins")) type = "skin";
    if (document.body.classList.contains("page-melees")) type = "melee";

    // Envoi au backend
    const res = await fetch("http://localhost/api/share.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        type: type,
        data: imageData
      })
    });

    const json = await res.json();

    if (json.success) {
      alert("Your tierlist has been shared successfully.");
    } else {
      alert("Error: " + json.error);
    }
  });
}
