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
function setupMouseDragAndDrop(mapCard, img) {
  mapCard.setAttribute("draggable", "true");
  mapCard.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", mapCard.id);
    const rect = img.getBoundingClientRect();
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;
    const canvas = document.createElement("canvas");
    canvas.width = displayedWidth;
    canvas.height = displayedHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, displayedWidth, displayedHeight);
    const dragImage = new Image();
    dragImage.src = canvas.toDataURL();
    dragImage.style.position = "absolute";
    dragImage.style.top = "-9999px";
    dragImage.style.pointerEvents = "none";
    document.body.appendChild(dragImage);
    if (dragImage.complete) {
      e.dataTransfer.setDragImage(
        dragImage,
        displayedWidth / 2,
        displayedHeight / 2
      );
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    } else {
      dragImage.onload = () => {
        e.dataTransfer.setDragImage(
          dragImage,
          displayedWidth / 2,
          displayedHeight / 2
        );
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      };
    }
    mapCard.classList.add("dragging");
  });

  mapCard.addEventListener("dragend", () => {
    mapCard.classList.remove("dragging");
  });
}
// ---------------------------------------------
function setupTouchDragAndDrop(mapCard) {
  let isDragging = false;
  let offsetX, offsetY;
  let startParent = null;

  mapCard.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      isDragging = true;
      const touch = e.touches[0];
      offsetX = touch.clientX - mapCard.getBoundingClientRect().left;
      offsetY = touch.clientY - mapCard.getBoundingClientRect().top;
      mapCard.style.position = "absolute";
      mapCard.style.zIndex = "1000";
      mapCard.style.width = mapCard.offsetWidth + "px";
      mapCard.style.height = mapCard.offsetHeight + "px";
      startParent = mapCard.parentElement; // Stocke le parent initial
      document.body.appendChild(mapCard);
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      mapCard.style.left = touch.clientX - offsetX + "px";
      mapCard.style.top = touch.clientY - offsetY + "px";
    },
    { passive: false }
  );

  document.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    // Trouver la zone de drop sous le doigt
    const touch = e.changedTouches[0];
    const dropElement = document.elementFromPoint(touch.clientX, touch.clientY);

    // Remonter dans le DOM pour trouver un parent .tier-cards
    let dropZone = dropElement.closest(".tier-cards");

    // Si une zone valide est trouvée, déplacer la carte
    if (dropZone) {
      dropZone.appendChild(mapCard);
    } else {
      // Sinon, retourner la carte à son parent initial
      if (startParent) {
        startParent.appendChild(mapCard);
      }
    }

    // Réinitialiser le style
    mapCard.style.position = "";
    mapCard.style.zIndex = "";
    mapCard.style.left = "";
    mapCard.style.top = "";
    mapCard.style.width = "";
    mapCard.style.height = "";
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
