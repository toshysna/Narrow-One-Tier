// ------------------------------------------------------------
// 1) Détection automatique du fichier JSON selon la page
// ------------------------------------------------------------
const pageName = window.location.pathname.toLowerCase();

let jsonFile = "/js/maps.json"; // fallback par défaut (chemin ABSOLU)

if (pageName.includes("bow-tier")) {
  jsonFile = "/js/bows.json";
} else if (pageName.includes("melee-tier")) {
  jsonFile = "/js/melees.json";
} else if (pageName.includes("arrow-tier")) {
  jsonFile = "/js/arrows.json";
} else if (pageName.includes("skin-tier")) {
  jsonFile = "/js/skins.json";
}

// ------------------------------------------------------------
// 2) Détection du périphérique
// ------------------------------------------------------------
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.includes("Android") ||
    navigator.userAgent.includes("iPhone") ||
    navigator.userAgent.includes("iPad")
  );
}

// ------------------------------------------------------------
// 3) Drag & Drop souris (desktop)
// ------------------------------------------------------------
function setupMouseDragAndDrop(card, img) {
  card.setAttribute("draggable", "true");

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", card.id);

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    if (isFirefox) {
      card.classList.add("dragging");
      return;
    }

    const rect = img.getBoundingClientRect();
    const ghost = img.cloneNode(true);

    ghost.style.position = "fixed";
    ghost.style.top = e.clientY + "px";
    ghost.style.left = e.clientX + "px";
    ghost.style.width = rect.width + "px";
    ghost.style.height = rect.height + "px";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.9";
    ghost.style.zIndex = "9999";

    document.body.appendChild(ghost);

    e.dataTransfer.setDragImage(ghost, rect.width / 2, rect.height / 2);

    setTimeout(() => ghost.remove(), 0);

    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
}

// ------------------------------------------------------------
// 4) Drag & Drop mobile (touch)
// ------------------------------------------------------------
function setupTouchDragAndDrop(card) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startParent = null;
  let ghost = null;

  card.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      isDragging = true;

      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();

      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      startParent = card.parentElement;

      ghost = card.cloneNode(true);
      ghost.style.position = "fixed";
      ghost.style.top = rect.top + "px";
      ghost.style.left = rect.left + "px";
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      ghost.style.pointerEvents = "none";
      ghost.style.opacity = "0.8";
      ghost.style.zIndex = "9999";

      document.body.appendChild(ghost);

      card.style.opacity = "0";
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || !ghost) return;
      e.preventDefault();

      const touch = e.touches[0];
      ghost.style.left = touch.clientX - offsetX + "px";
      ghost.style.top = touch.clientY - offsetY + "px";
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;
      isDragging = false;

      const touch = e.changedTouches[0];
      const dropElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      const dropZone = dropElement ? dropElement.closest(".tier-cards") : null;

      if (dropZone) {
        dropZone.appendChild(card);
      } else {
        startParent.appendChild(card);
      }

      if (ghost) ghost.remove();
      ghost = null;

      card.style.opacity = "1";
    },
    { passive: false }
  );
}

// ------------------------------------------------------------
// 5) Chargement du JSON + création des cartes
// ------------------------------------------------------------
const mapsContainer = document.getElementById("maps");

fetch(jsonFile)
  .then((response) => response.json())
  .then((items) => {
    items.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("map-card");
      card.id = `card-${item.id}`;

      const img = document.createElement("img");

      // Correction automatique du chemin image
      img.src = item.image.startsWith("/") ? item.image : "/" + item.image;

      img.alt = item.name;

      card.appendChild(img);
      mapsContainer.appendChild(card);

      if (isMobileDevice()) {
        setupTouchDragAndDrop(card);
      } else {
        setupMouseDragAndDrop(card, img);
      }
    });
  })
  .catch((err) => console.error("Erreur chargement JSON :", err));
