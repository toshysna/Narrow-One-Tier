// Pour invoquer la div #maps dans la variable mapsContainer
const mapsContainer = document.getElementById("maps");

// Pour charger le fichier JSON
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

        // Je fais une version réduite de l'image pour le drag preview
        const dragPreview = img.cloneNode();

        Object.assign(dragPreview.style, {
          width: "100px", // ajustable selon besoin
          height: "auto",
          position: "absolute",
          top: "-9999px",
          pointerEvents: "none",
        });

        document.body.appendChild(dragPreview);

        // J'utilise le dragPreview comme image de drag
        e.dataTransfer.setDragImage(dragPreview, 50, 50); // offsets ajustables

        mapCard.classList.add("dragging");

        //  Je sup le dragPreview juste après
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);
      });

      mapCard.addEventListener("dragend", () => {
        mapCard.classList.remove("dragging");
      });

      mapCard.id = `card-${map.id}`;
    });
    console.log(maps);
  });
