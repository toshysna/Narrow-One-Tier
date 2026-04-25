// ------------------------------------------------------------
// 1) Configuration des tiers
// ------------------------------------------------------------
const TIERS = ["S", "A", "B", "C", "EW"];

// ------------------------------------------------------------
// 2) Création d'une rangée (S, A, B, C, EW)
// ------------------------------------------------------------
function createTierRow(name) {
  const row = document.createElement("div");
  row.classList.add("tier-row", `tier-${name}`);

  const title = document.createElement("h2");
  title.textContent = name;
  title.contentEditable = true;

  title.addEventListener("dragover", e => e.preventDefault());
  title.addEventListener("drop", e => e.preventDefault());

  const cards = document.createElement("div");
  cards.classList.add("tier-cards");

  row.appendChild(title);
  row.appendChild(cards);

  return row;
}

// ------------------------------------------------------------
// 3) Gestion du drag & drop
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
      if (!afterElement) zone.appendChild(draggedCard);
      else zone.insertBefore(draggedCard, afterElement);
    });

    zone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedCard = document.getElementById(draggedId);
      if (!draggedCard) return;

      const afterElement = getDragAfterElement(zone, e.clientX);
      if (!afterElement) zone.appendChild(draggedCard);
      else zone.insertBefore(draggedCard, afterElement);
    });
  });
}

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
// 4) BOUTON SHARE
// ------------------------------------------------------------
function setupShareButton() {
  const btn = document.getElementById("share-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    const auth = await fetch("https://n1tier.alwaysdata.net/api/me.php", { credentials: "include" })
      .then(r => r.json());

    if (!auth.authenticated) {
        playRiveLoginToast();
        return;
    }

    const element = document.getElementById("tier-list");
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null
    });

    const imageData = canvas.toDataURL("image/png");

    let type = null;
    if (document.body.classList.contains("page-maps")) type = "map";
    if (document.body.classList.contains("page-bows")) type = "bow";
    if (document.body.classList.contains("page-arrows")) type = "arrow";
    if (document.body.classList.contains("page-skins")) type = "skin";
    if (document.body.classList.contains("page-melees")) type = "melee";

    const res = await fetch("https://n1tier.alwaysdata.net/api/share.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ type, data: imageData })
    });

    const json = await res.json();

    if (json.success) {
        playRiveShareToast();
        return;
    }
  });
}

// ------------------------------------------------------------
// 5) BOUTON COMMUNITY
// ------------------------------------------------------------
function setupCommunityButton() {
  const communityBtn = document.getElementById("community-btn");
  if (!communityBtn) return;

  communityBtn.addEventListener("click", () => {
    window.location.href = "/pages/community/?category=all&sort=recent";
  });
}

// ------------------------------------------------------------
// 6) INITIALISATION GLOBALE + RIVE
// ------------------------------------------------------------
let riveLogin;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM READY — RIVE INIT SHOULD RUN");

    const container = document.getElementById("tier-list");
    if (!container) return;

    TIERS.forEach(tierName => {
        const row = createTierRow(tierName);
        container.appendChild(row);
    });

    setupTierDropZones();
    setupShareButton();
    setupCommunityButton();

    // --- RIVE INIT ---
    const canvas = document.getElementById("rive-toast-canvas");

    // Résolution interne → animation nette
    canvas.width = 600;
    canvas.height = 600;

    riveLogin = new rive.Rive({
        src: "/assets/animations/login_share.riv",
        canvas: canvas,
        autoplay: false,
        stateMachines: "State Machine 1",
        onLoad: () => {
            // Ajuste le rendu → proportions parfaites
            riveLogin.resizeDrawingSurfaceToCanvas();
        }
    });

    console.log("CANVAS =", canvas);
    console.log("RIVE =", riveLogin);
});

// --- RIVE SHARE INIT ---
let riveShare;

const shareCanvas = document.getElementById("rive-share-canvas");
if (shareCanvas) {
    shareCanvas.width = 600;
    shareCanvas.height = 600;

    riveShare = new rive.Rive({
        src: "/assets/animations/shared_community.riv",
        canvas: shareCanvas,
        autoplay: false,
        stateMachines: "State Machine 1",
        onLoad: () => {
            riveShare.resizeDrawingSurfaceToCanvas();
        }
    });
}

// ------------------------------------------------------------
// 7) TOAST RIVE
// ------------------------------------------------------------
function playRiveLoginToast() {
    const wrapper = document.getElementById("rive-toast-wrapper");
    wrapper.classList.add("show");

    const inputs = riveLogin.stateMachineInputs("State Machine 1");
    const trigger = inputs.find(i => i.type === "trigger");

    if (trigger) trigger.fire();
    else riveLogin.play();

    riveLogin.on("stop", () => {
        wrapper.classList.remove("show");
    });
}

function playRiveShareToast() {
    const wrapper = document.getElementById("rive-share-wrapper");
    wrapper.classList.add("show");

    const inputs = riveShare.stateMachineInputs("State Machine 1");
    const trigger = inputs.find(i => i.type === "trigger");

    if (trigger) trigger.fire();
    else riveShare.play();

    riveShare.on("stop", () => {
        wrapper.classList.remove("show");
    });
}
