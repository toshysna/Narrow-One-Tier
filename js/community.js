let ALL_TIERLISTS = [];
let auth = { authenticated: false };

// Chargement des tierlists
fetch("https://n1tier.alwaysdata.net/api/get_tierlists.php", { credentials: "include" })
  .then(res => res.json())
  .then(async list => {

      // Récupérer l'utilisateur connecté
      auth = await fetch("https://n1tier.alwaysdata.net/api/me.php", { credentials: "include" })
          .then(r => r.json())
          .catch(() => ({ authenticated: false }));

      // ⭐ FIX : convertir score et user_vote en nombres
      ALL_TIERLISTS = list.map(t => ({
          ...t,
          score: Number(t.score),
          user_vote: Number(t.user_vote)
      }));

      // ⭐ POPULAR PAR DÉFAUT
      document.getElementById("filter-sort").value = "recent";

      // ⭐ Mettre à jour le dropdown custom
      const sortDropdown = document.querySelector('[data-filter="sort"] .filter-selected');
      if (sortDropdown) sortDropdown.textContent = "Recent";

      renderTierlists();
  })
  .catch(err => {
      document.getElementById("community-container").innerHTML =
          "<div class='loading'>Failed to load tierlists.</div>";
  });



function formatDateEN(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

// ------------------------------------------------------------
// RENDER AVEC FILTRES + SCORE + UPVOTE/DOWNVOTE
// ------------------------------------------------------------
function renderTierlists() {
    const container = document.getElementById("community-container");
    container.innerHTML = "";

    if (!ALL_TIERLISTS.length) {
        container.innerHTML = "<div class='loading'>No tierlists shared yet.</div>";
        return;
    }

    const category = document.getElementById("filter-category")?.value || "all";
    const sort = document.getElementById("filter-sort")?.value || "recent";

    let filtered = [...ALL_TIERLISTS];

    // FILTRE PAR TYPE
    if (category !== "all") {
        filtered = filtered.filter(t => t.type === category);
    }

    // TRI
    if (sort === "recent") {
        filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }

    if (sort === "popular") {
        filtered.sort((a, b) => b.score - a.score);
    }

    // RENDER
    filtered.forEach(t => {
        const isOwner = auth.authenticated && auth.user.id == t.user_id;

        container.innerHTML += `
            <div class="tierlist-card" id="card-${t.id}">

                ${isOwner ? `
                    <div class="options-menu">
                        <img src="/assets/icons/dots.svg" class="more-icon" data-id="${t.id}" data-type="${t.type}">
                        <div class="dropdown hidden" id="dropdown-${t.id}">
                            <div class="dropdown-item update" data-type="${t.type}">Update</div>
                            <div class="dropdown-item delete" data-id="${t.id}">Delete</div>
                        </div>
                    </div>
                ` : ""}

                <div class="author-row">
                    <div class="author-left">
                        <img class="avatar" src="${t.avatar}" alt="avatar">
                        <div class="info">
                            <span class="username">
                            ${t.global_name || t.username}
                            ${auth.authenticated && auth.user.id == t.user_id ? "<span style='opacity:0.6'>(you)</span>" : ""}
                           </span>

                            <span class="date">Updated on ${formatDateEN(t.updated_at)}</span>
                        </div>
                    </div>

                    <div class="author-right">
                        <img src="/assets/icons/${t.type}.png" class="type-icon">
                        <span class="type-text">${t.type}</span>
                    </div>
                </div>


                <div class="tierlist-preview">
                    <img src="${t.data}" class="tierlist-image" alt="tierlist" />
                </div>

                <!-- ⭐ UPVOTE / DOWNVOTE ⭐ -->
                <div class="vote-row">

                    <div class="vote-section">

                        <span class="upvote ${t.user_vote == 1 ? "active" : ""}" data-id="${t.id}">
                            <svg viewBox="0 0 24 24" class="vote-icon">
                                <path d="M12 4 L4 14 H10 V20 H14 V14 H20 Z"/>
                            </svg>
                        </span>

                        <span class="score" id="score-${t.id}">${t.score}</span>

                        <span class="downvote ${t.user_vote == -1 ? "active" : ""}" data-id="${t.id}">
                            <svg viewBox="0 0 24 24" class="vote-icon">
                                <path d="M12 20 L4 10 H10 V4 H14 V10 H20 Z"/>
                            </svg>
                        </span>

                    </div>

                    <div class="expand-container">
                        <img src="/assets/icons/fullScreen.svg"
                             class="expand-icon"
                             data-full="${t.data}"
                             alt="expand">
                    </div>

                </div>

            </div>
        `;
    });

    setupOptionsMenu();
    setupDeleteActions();
    setupUpdateActions();
    setupVotes(); // ⭐ activation du système de vote
}


// ------------------------------------------------------------
// 1) Ouvrir / fermer le menu ⋮
// ------------------------------------------------------------
function setupOptionsMenu() {
    document.querySelectorAll(".more-icon").forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = icon.dataset.id;
            const dropdown = document.getElementById(`dropdown-${id}`);

            document.querySelectorAll(".dropdown").forEach(d => {
                if (d !== dropdown) d.classList.add("hidden");
            });

            dropdown.classList.toggle("hidden");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown").forEach(d => d.classList.add("hidden"));
    });
}


// ------------------------------------------------------------
// 2) DELETE
// ------------------------------------------------------------
function setupDeleteActions() {
    document.querySelectorAll(".dropdown-item.delete").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            const res = await fetch("https://n1tier.alwaysdata.net/api/delete_tierlist.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ id })
            });

            const json = await res.json();

            if (json.success) {
                document.getElementById(`card-${id}`).remove();
                ALL_TIERLISTS = ALL_TIERLISTS.filter(t => t.id != id);
            }
        });
    });
}


// ------------------------------------------------------------
// 3) UPDATE
// ------------------------------------------------------------
function setupUpdateActions() {
    document.querySelectorAll(".dropdown-item.update").forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;

            const pages = {
                map: "/pages/map-tierlist/",
                bow: "/pages/bow-tierlist/",
                arrow: "/pages/arrow-tierlist/",
                skin: "/pages/skin-tierlist/",
                melee: "/pages/melee-tierlist/"
            };

            if (pages[type]) {
                window.location.href = pages[type];
            }
        });
    });
}


// ------------------------------------------------------------
// 4) LISTENERS DES FILTRES
// ------------------------------------------------------------
document.getElementById("filter-category")?.addEventListener("change", renderTierlists);
document.getElementById("filter-sort")?.addEventListener("change", renderTierlists);


// ------------------------------------------------------------
// 5) DROPDOWN CUSTOM POUR LES FILTRES
// ------------------------------------------------------------
document.querySelectorAll(".filter-dropdown").forEach(drop => {
    const selected = drop.querySelector(".filter-selected");
    const options = drop.querySelector(".filter-options");

    selected.addEventListener("click", () => {
        document.querySelectorAll(".filter-options").forEach(o => {
            if (o !== options) o.classList.add("hidden");
        });
        options.classList.toggle("hidden");
    });

    drop.querySelectorAll(".filter-option").forEach(opt => {
        opt.addEventListener("click", () => {
            selected.textContent = opt.textContent;
            options.classList.add("hidden");

            const filterType = drop.dataset.filter;
            const value = opt.dataset.value;

            if (filterType === "category") {
                document.getElementById("filter-category").value = value;
            } else {
                document.getElementById("filter-sort").value = value;
            }

            renderTierlists();
        });
    });
});

document.addEventListener("click", e => {
    if (!e.target.closest(".filter-dropdown")) {
        document.querySelectorAll(".filter-options").forEach(o => o.classList.add("hidden"));
    }
});


// ------------------------------------------------------------
// ⭐ 6) UPVOTE / DOWNVOTE — VERSION FIXÉE
// ------------------------------------------------------------
function setupVotes() {
    document.querySelectorAll(".upvote").forEach(btn => {
        btn.addEventListener("click", () => sendVote(btn.dataset.id, 1));
    });

    document.querySelectorAll(".downvote").forEach(btn => {
        btn.addEventListener("click", () => sendVote(btn.dataset.id, -1));
    });
}

async function sendVote(id, vote) {

    // ⭐ SI NON CONNECTÉ → jouer l’animation et STOP
    if (!auth || !auth.authenticated) {
        playRiveUpvote();
        return;
    }

    const res = await fetch("https://n1tier.alwaysdata.net/api/vote_tierlist.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ tierlist_id: id, vote })
    });

    const json = await res.json();
    if (!json.success) return;

    const t = ALL_TIERLISTS.find(x => x.id == id);
    if (!t) return;

    // ⭐ FIX : convertir en nombre
    const oldVote = Number(t.user_vote) || 0;
    const newVote = Number(json.vote);

    // ⭐ CALCUL DU SCORE
    if (oldVote === 1 && newVote === 0) t.score -= 1;
    else if (oldVote === -1 && newVote === 0) t.score += 1;
    else if (oldVote === -1 && newVote === 1) t.score += 2;
    else if (oldVote === 1 && newVote === -1) t.score -= 2;
    else if (oldVote === 0 && newVote === 1) t.score += 1;
    else if (oldVote === 0 && newVote === -1) t.score -= 1;

    // ⭐ MAJ du vote utilisateur
    t.user_vote = newVote;

    // ⭐ Mise à jour visuelle
    const scoreEl = document.getElementById(`score-${id}`);
    if (scoreEl) scoreEl.textContent = t.score;

    const upEl = document.querySelector(`#card-${id} .upvote`);
    const downEl = document.querySelector(`#card-${id} .downvote`);

    if (!upEl || !downEl) return;

    upEl.classList.toggle("active", newVote === 1);
    downEl.classList.toggle("active", newVote === -1);
}


// ------------------------------------------------------------
// NAV
// ------------------------------------------------------------
document.getElementById("back-maker").addEventListener("click", () => {
    window.location.href = "/pages/map-tierlist/";
});

document.getElementById("my-profile").addEventListener("click", () => {
    window.location.href = "/pages/profile/";
});

// ------------------------------------------------------------
// ⭐ 7) IMAGE VIEWER
// ------------------------------------------------------------

// Active le fullscreen sur l'icône expand
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("expand-icon")) {
        const full = e.target.dataset.full;
        openImageViewer(full);
    }
});

function openImageViewer(src) {
    const viewer = document.getElementById("image-viewer");
    const viewerImg = document.getElementById("image-viewer-img");

    viewerImg.src = src;
    viewer.classList.remove("hidden");
}

function closeImageViewer() {
    document.getElementById("image-viewer").classList.add("hidden");
}

// Fermer en cliquant sur le fond
document.getElementById("image-viewer-overlay").addEventListener("click", closeImageViewer);

// Fermer avec ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImageViewer();
});

// ------------------------------------------------------------
// RIVE UPVOTE ANIMATION
// ------------------------------------------------------------
let riveUpvote;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("rive-upvote-canvas");
    if (!canvas) return;

    // Résolution interne → animation nette
    canvas.width = 600;
    canvas.height = 600;

    riveUpvote = new rive.Rive({
        src: "/assets/animations/login_upvote.riv",
        canvas: canvas,
        autoplay: false,
        stateMachines: "State Machine 1",
        onLoad: () => {
            riveUpvote.resizeDrawingSurfaceToCanvas();
        }
    });
});

// ------------------------------------------------------------
// PLAY UPVOTE ANIMATION
// ------------------------------------------------------------
function playRiveUpvote() {
    const wrapper = document.getElementById("rive-upvote-wrapper");
    wrapper.classList.add("show");

    const inputs = riveUpvote.stateMachineInputs("State Machine 1");
    const trigger = inputs.find(i => i.type === "trigger");

    if (trigger) trigger.fire();
    else riveUpvote.play();

    riveUpvote.on("stop", () => {
        wrapper.classList.remove("show");
    });
}
