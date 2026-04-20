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
  setupScreenshotButton();
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
// 5) Capture du tableau en image
// ------------------------------------------------------------
function setupScreenshotButton() {
  const btn = document.getElementById("capture-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const element = document.getElementById("tier-list");

    html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null
    }).then(canvas => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "tierlist.png";
      link.click();
    });
  });
}
