const tiers = ["S", "A", "B", "C", "EW"]; //tableau par default
const tierListContainer = document.getElementById("tier-list"); // grab la div html avec comme id "tier-list" et le stock dans la variable tierListContainer

tiers.forEach((tierName) => {
  const tierRow = document.createElement("div"); //ajoute une div pour la rangée
  tierRow.classList.add("tier-row", `tier-${tierName}`); // ajoute une class "tier-row" à la div. Ajoute aussi une classe "tier-S", "tier-A", etc.

  const tierTitle = document.createElement("h2"); // ajoute balise h2 au row
  tierTitle.textContent = tierName; // definit le texte par defaut (S,A etc)
  tierTitle.contentEditable = true; // permet de renommer

  const tierCards = document.createElement("div"); //create div vide qui va acceuillir toute les cartes
  tierCards.classList.add("tier-cards");

  tierCards.addEventListener("dragover", (e) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(draggedId);
    if (!draggedCard) return;

    const afterElement = getDragAfterElement(tierCards, e.clientX);

    if (!afterElement) {
      tierCards.appendChild(draggedCard); // à la fin
    } else {
      tierCards.insertBefore(draggedCard, afterElement); // entre deux cartes
    }
  });

  tierCards.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(draggedId);
    if (!draggedCard) return;

    const afterElement = getDragAfterElement(tierCards, e.clientX);

    if (!afterElement) {
      tierCards.appendChild(draggedCard);
    } else {
      tierCards.insertBefore(draggedCard, afterElement);
    }
  });

  function getDragAfterElement(container, x) {
    const cards = [...container.querySelectorAll(".map-card:not(.dragging)")];

    return cards.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - (box.left + box.width / 2);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  tierRow.appendChild(tierTitle); //Row parent de Title
  tierRow.appendChild(tierCards); //Row parent de Cards
  tierListContainer.appendChild(tierRow); //ListContainer parent de Row
});

document.getElementById("capture-btn").addEventListener("click", () => {
  const element = document.getElementById("tier-list");

  html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    backgroundColor: null, // garde la transparence si nécessaire
  }).then((canvas) => {
    // Convertit le canvas en image PNG
    const imgData = canvas.toDataURL("image/png");

    // Crée un lien de téléchargement
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "tierlist results.png";
    link.click();
  });
});
/*   if (draggedCard) {
      e.currentTarget.appendChild(draggedCard); // déplace la carte
    } */
