// Pour invoquer la div #maps dans la variable mapsContainer
const mapsContainer = document.getElementById("maps");
// Pour Charger le fichier.json
fetch("js/maps.json")
  // transforme la réponse brute en données utilisables (tableau d’objets)
  .then((response) => response.json())
  .then((maps) => {
    //boucle sur chaque map
    maps.forEach((map) => {
      // ici je crée mon encadré sous la forme d'une balise div
      const mapCard = document.createElement("div");
      // crée une classe "map-card"
      mapCard.classList.add("map-card");
      // crée <img src="x" alt="x">
      const img = document.createElement("img");
      img.src = map.image;
      img.alt = map.name;
      // crée <p textContent="x">
      const title = document.createElement("p");
      title.textContent = map.name;
      // img et title sont les enfants de mapCard
      mapCard.appendChild(img);
      mapsContainer.appendChild(mapCard);

      // 🔁 DRAG START
      mapCard.setAttribute("draggable", "true");
      /*e = evenement dragstart, e.datatransfer = objet special qui permet stockage info
      setData(type, data) = je déplace cette carte en particulier en prenant son id. */
      mapCard.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", mapCard.id);
        const offsetX = img.width / 2;
        const offsetY = img.height / 2;
        // afficher image sous curseur
        e.dataTransfer.setDragImage(img, offsetX, offsetY);
        mapCard.classList.add("dragging");
      });
      mapCard.addEventListener("dragend", () => {
        mapCard.classList.remove("dragging");
      });

      // crée une identité js unique pour chaque map
      mapCard.id = `card-${map.id}`;
    });
    console.log(maps);
  });
