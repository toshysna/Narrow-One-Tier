let ALL_TIERLISTS = [];
let auth = { authenticated: false };

// ⭐ INFINITE SCROLL
let PAGE_SIZE = 5;
let currentIndex = 0;

// ⭐ LOADER
let loader = null;

document.addEventListener("DOMContentLoaded", () => {
    loader = document.getElementById("loader");
    showLoader(); // loader centré au début
});

function showLoader() {
    if (loader) loader.style.display = "block";
}

function hideLoader() {
    if (loader) loader.style.display = "none";
}

function placeLoaderAtBottom() {
    const container = document.getElementById("community-container");
    if (loader) container.appendChild(loader);
}

// ------------------------------------------------------------
// FETCH INITIAL
// ------------------------------------------------------------
fetch("https://n1tier.alwaysdata.net/api/get_tierlists.php", { credentials: "include" })
    .then(res => res.json())
    .then(async list => {

        auth = await fetch("https://n1tier.alwaysdata.net/api/me.php", { credentials: "include" })
            .then(r => r.json())
            .catch(() => ({ authenticated: false }));

        ALL_TIERLISTS = list.map(t => ({
            ...t,
            score: Number(t.score),
            user_vote: Number(t.user_vote)
        }));

        document.getElementById("filter-sort").value = "popular";
        const sortDropdown = document.querySelector('[data-filter="sort"] .filter-selected');
        if (sortDropdown) sortDropdown.textContent = "Popular";

        currentIndex = 0;
        renderTierlists();
        hideLoader(); // cacher après premier rendu
    })
    .catch(err => {
        const container = document.getElementById("community-container");
        container.innerHTML = "<div class='loading'>Failed to load tierlists.</div>";
        hideLoader();
    });


// ------------------------------------------------------------
// FORMAT DATE
// ------------------------------------------------------------
function formatDateEN(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}


// ------------------------------------------------------------
// RENDER
// ------------------------------------------------------------
function renderTierlists() {
    const container = document.getElementById("community-container");

    // enlever anciens messages
    container.querySelectorAll(".loading").forEach(m => m.remove());

    // enlever anciennes cartes
    container.querySelectorAll(".tierlist-card").forEach(c => c.remove());

    if (!ALL_TIERLISTS.length) {
        container.insertAdjacentHTML(
            "beforeend",
            "<div class='loading'>No tierlists shared yet.</div>"
        );
        return;
    }

    const category = document.getElementById("filter-category")?.value || "all";
    const sort = document.getElementById("filter-sort")?.value || "popular";

    let filtered = [...ALL_TIERLISTS];

    if (category !== "all") filtered = filtered.filter(t => t.type === category);
    if (sort === "recent") filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (sort === "popular") filtered.sort((a, b) => b.score - a.score);

    const slice = filtered.slice(0, currentIndex + PAGE_SIZE);

    slice.forEach(t => {
        const isOwner = auth.authenticated && auth.user.id == t.user_id;

        container.insertAdjacentHTML("beforeend", `
            <div class="tierlist-card" id="card-${t.id}">
                ${isOwner ? `
                    <div class="options-menu">
                        <img src="/assets/icons/dots.svg" class="more-icon" data-id="${t.id}" data-type="${t.type}">
                        <div class="dropdown hidden" id="dropdown-${t.id}">
                            <div class="dropdown-item update" data-type="${t.type}">Update</div>
                            <div class="dropdown-item delete" data-id="${t.id}">Delete</div>
                        </div>
                    </div>` : ""}

                <div class="author-row">
                    <div class="author-left">
                        <img class="avatar" src="${t.avatar}">
                        <div class="info">
                            <span class="username">${t.global_name || t.username}
                                ${isOwner ? "<span style='opacity:0.6'>(you)</span>" : ""}
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
                    <img src="${t.data}" class="tierlist-image">
                </div>

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
                        <img src="/assets/icons/fullScreen.svg" class="expand-icon" data-full="${t.data}">
                    </div>
                </div>
            </div>
        `);
    });

    currentIndex = slice.length;

    setupOptionsMenu();
    setupDeleteActions();
    setupUpdateActions();
    setupVotes();

    // ⭐ placer loader en bas après ajout
    placeLoaderAtBottom();
    hideLoader();
}


// ------------------------------------------------------------
// OPTIONS MENU
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
// DELETE
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
// UPDATE
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
// FILTERS
// ------------------------------------------------------------
document.getElementById("filter-category")?.addEventListener("change", () => {
    currentIndex = 0;
    showLoader();
    renderTierlists();
});

document.getElementById("filter-sort")?.addEventListener("change", () => {
    currentIndex = 0;
    showLoader();
    renderTierlists();
});


// ------------------------------------------------------------
// UPVOTES
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

    const oldVote = Number(t.user_vote) || 0;
    const newVote = Number(json.vote);

    if (oldVote === 1 && newVote === 0) t.score -= 1;
    else if (oldVote === -1 && newVote === 0) t.score += 1;
    else if (oldVote === -1 && newVote === 1) t.score += 2;
    else if (oldVote === 1 && newVote === -1) t.score -= 2;
    else if (oldVote === 0 && newVote === 1) t.score += 1;
    else if (oldVote === 0 && newVote === -1) t.score -= 1;

    t.user_vote = newVote;

    const scoreEl = document.getElementById(`score-${id}`);
    if (scoreEl) scoreEl.textContent = t.score;

    const upEl = document.querySelector(`#card-${id} .upvote`);
    const downEl = document.querySelector(`#card-${id} .downvote`);

    if (!upEl || !downEl) return;

    upEl.classList.toggle("active", newVote === 1);
    downEl.classList.toggle("active", newVote === -1);
}


// ------------------------------------------------------------
// IMAGE VIEWER
// ------------------------------------------------------------
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

document.getElementById("image-viewer-overlay").addEventListener("click", closeImageViewer);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImageViewer();
});


// ------------------------------------------------------------
// RIVE UPVOTE
// ------------------------------------------------------------
let riveUpvote;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("rive-upvote-canvas");
    if (!canvas) return;

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


// ------------------------------------------------------------
// INFINITE SCROLL
// ------------------------------------------------------------
window.addEventListener("scroll", () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (bottom) {
        showLoader();
        placeLoaderAtBottom();
        renderTierlists();
    }
});
