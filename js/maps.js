// Détection automatique du nom de la page
const pageName = window.location.pathname.split("/").pop().toLowerCase();
// Mapping entre page et fichier JSON
let jsonFile;
if (pageName.includes("bow-tier")) {
  jsonFile = "js/bows.json";
} else if (pageName.includes("index")) {
  jsonFile = "js/maps.json";
} else if (pageName.includes("melee-tier")) {
  jsonFile = "js/melees.json";
} else if (pageName.includes("arrow-tier")) {
  jsonFile = "js/arrows.json";
} else if (pageName.includes("skin-tier")) {
  jsonFile = "js/skins.json";
} else {
  jsonFile = "js/maps.json"; // fallback par défaut
}

// Pour invoquer la div #maps dans la variable mapsContainer
const mapsContainer = document.getElementById("maps");

// Détection du périphérique
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1 ||
    navigator.userAgent.indexOf("Android") !== -1 ||
    navigator.userAgent.indexOf("iPhone") !== -1 ||
    navigator.userAgent.indexOf("iPad") !== -1
  );
}

// Fonction pour le drag-and-drop souris (ordinateur)
const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

function setupMouseDragAndDrop(mapCard, img) {
  mapCard.setAttribute("draggable", "true");

  mapCard.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", mapCard.id);

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    if (isFirefox) {
      // Firefox → on NE met PAS de setDragImage
      // On laisse Firefox gérer son ghost
      mapCard.classList.add("dragging");
      return;
    }

    // Chrome / Edge / Opera → ghost custom
    const rect = img.getBoundingClientRect();
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    const ghost = img.cloneNode(true);
    ghost.style.position = "fixed";
    ghost.style.top = e.clientY + "px";
    ghost.style.left = e.clientX + "px";
    ghost.style.width = displayedWidth + "px";
    ghost.style.height = displayedHeight + "px";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.9";
    ghost.style.zIndex = "9999";

    document.body.appendChild(ghost);

    e.dataTransfer.setDragImage(
      ghost,
      displayedWidth / 2,
      displayedHeight / 2
    );

    setTimeout(() => ghost.remove(), 0);

    mapCard.classList.add("dragging");
  });

  mapCard.addEventListener("dragend", () => {
    mapCard.classList.remove("dragging");
  });
}



// ---------------------------------------------
function setupTouchDragAndDrop(mapCard) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startParent = null;
  let ghost = null;

  mapCard.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDragging = true;

    const touch = e.touches[0];
    const rect = mapCard.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    startParent = mapCard.parentElement;

    // Création du ghost qui suit le doigt
    ghost = mapCard.cloneNode(true);
    ghost.style.position = "fixed";
    ghost.style.top = rect.top + "px";
    ghost.style.left = rect.left + "px";
    ghost.style.width = rect.width + "px";
    ghost.style.height = rect.height + "px";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.8";
    ghost.style.zIndex = "9999";

    document.body.appendChild(ghost);

    // On retire la vraie carte du DOM pour éviter les conflits
    mapCard.style.opacity = "0";
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging || !ghost) return;
    e.preventDefault();

    const touch = e.touches[0];

    ghost.style.left = (touch.clientX - offsetX) + "px";
    ghost.style.top = (touch.clientY - offsetY) + "px";
  }, { passive: false });

  document.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const touch = e.changedTouches[0];
    const dropElement = document.elementFromPoint(touch.clientX, touch.clientY);

    let dropZone = dropElement ? dropElement.closest(".tier-cards") : null;

    // Si on drop dans une zone valide
    if (dropZone) {
      dropZone.appendChild(mapCard);
    } else {
      // Sinon retour à la position d'origine
      startParent.appendChild(mapCard);
    }

    // Nettoyage
    if (ghost) ghost.remove();
    ghost = null;

    mapCard.style.opacity = "1";
  });
}

// Chargement du fichier JSON contenant les maps
fetch(jsonFile)
  .then((response) => response.json())
  .then((maps) => {
    maps.forEach((map) => {
      const mapCard = document.createElement("div");
      mapCard.classList.add("map-card");
      const img = document.createElement("img");
      img.src = map.image;
      img.alt = map.name;
      mapCard.appendChild(img);
      mapsContainer.appendChild(mapCard);
      mapCard.id = `card-${map.id}`;

      // Activer le bon système de drag-and-drop
      if (isMobileDevice()) {
        setupTouchDragAndDrop(mapCard);
      } else {
        setupMouseDragAndDrop(mapCard, img);
      }
    });
    console.log(maps);
  });
