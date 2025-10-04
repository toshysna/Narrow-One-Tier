// Pour invoquer la div #maps dans la variable mapsContainer
const mapsContainer = document.getElementById("maps");

// Chargement du fichier JSON contenant les maps
fetch("js/maps.json")
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

        // Attente du chargement de l'image pour pouvoir l'utiliser comme drag preview
        dragImage.onload = () => {
          e.dataTransfer.setDragImage(
            dragImage,
            displayedWidth / 2,
            displayedHeight / 2
          );

          // Suppression de l'image temporaire juste après
          setTimeout(() => {
            document.body.removeChild(dragImage);
          }, 0);
        };

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
