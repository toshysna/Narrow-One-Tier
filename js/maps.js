// Détection automatique du nom de la page
const pageName = window.location.pathname.split("/").pop().toLowerCase();

// Mapping entre page et fichier JSON
const jsonFile = pageName.includes("bow-tier")
  ? "js/bows.json"
  : "js/maps.json"; // fallback par défaut

// Pour invoquer la div #maps dans la variable mapsContainer
const mapsContainer = document.getElementById("maps");

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

      mapCard.setAttribute("draggable", "true");

      mapCard.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", mapCard.id);

        // Récupère la taille réellement affichée de l'image
        const rect = img.getBoundingClientRect();
        const displayedWidth = rect.width;
        const displayedHeight = rect.height;

        // Création d'un canvas de même taille
        const canvas = document.createElement("canvas");
        canvas.width = displayedWidth;
        canvas.height = displayedHeight;

        const ctx = canvas.getContext("2d");

        // Dessine l'image source à la taille affichée
        ctx.drawImage(img, 0, 0, displayedWidth, displayedHeight);

        // Création d'une image temporaire à partir du canvas
        const dragImage = new Image();
        dragImage.src = canvas.toDataURL();
        dragImage.style.position = "absolute";
        dragImage.style.top = "-9999px";
        dragImage.style.pointerEvents = "none";
        document.body.appendChild(dragImage);

        if (dragImage.complete) {
          // Image déjà chargée (Chrome en cache) → on appelle directement
          e.dataTransfer.setDragImage(
            dragImage,
            displayedWidth / 2,
            displayedHeight / 2
          );
          setTimeout(() => {
            document.body.removeChild(dragImage);
          }, 0);
        } else {
          // Sinon, on attend le onload (Firefox, ou si pas en cache)
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

      // Affectation d'un ID unique à chaque carte
      mapCard.id = `card-${map.id}`;
    });

    console.log(maps);
  });
