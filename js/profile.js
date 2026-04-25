let ALL_TIERLISTS = [];
let auth = { authenticated: false };

// Charger toutes les tierlists
fetch("http://localhost/api/get_tierlists.php", { credentials: "include" })
  .then(res => res.json())
  .then(async list => {

      // Récupérer l'utilisateur connecté
      auth = await fetch("http://localhost/api/me.php", { credentials: "include" })
          .then(r => r.json())
          .catch(() => ({ authenticated: false }));

      if (!auth.authenticated) {
          document.getElementById("community-container").innerHTML =
              "<div class='loading'>You must be logged in.</div>";
          return;
      }

      // Garder uniquement les tierlists de l'utilisateur
      ALL_TIERLISTS = list.filter(t => t.user_id == auth.user.id);

      renderTierlists();
  })
  .catch(err => {
      document.getElementById("community-container").innerHTML =
          "<div class='loading'>Failed to load tierlists.</div>";
  });


// Format date
function formatDateEN(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}


// ------------------------------------------------------------
// RENDER — UNIQUEMENT TES TIERLISTS
// ------------------------------------------------------------
function renderTierlists() {
    const container = document.getElementById("community-container");
    container.innerHTML = "";

    if (!ALL_TIERLISTS.length) {
        container.innerHTML = "<div class='loading'>You haven't shared any tierlists yet.</div>";
        return;
    }

    ALL_TIERLISTS.forEach(t => {
        container.innerHTML += `
            <div class="tierlist-card" id="card-${t.id}">

                <div class="options-menu">
                    <img src="/assets/icons/dots.svg" class="more-icon" data-id="${t.id}" data-type="${t.type}">
                    <div class="dropdown hidden" id="dropdown-${t.id}">
                        <div class="dropdown-item update" data-type="${t.type}">Update</div>
                        <div class="dropdown-item delete" data-id="${t.id}">Delete</div>
                    </div>
                </div>

                <div class="author-row">
                    <div class="author-left">
                        <img class="avatar" src="${t.avatar}" alt="avatar">
                        <div class="info">
                            <span class="username">${t.global_name || t.username} <span style="opacity:0.6">(you)</span></span>
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

            </div>
        `;
    });

    setupOptionsMenu();
    setupDeleteActions();
    setupUpdateActions();
}


// ------------------------------------------------------------
// MENU ⋮
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

            const res = await fetch("http://localhost/api/delete_tierlist.php", {
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
// HEADER BUTTONS
// ------------------------------------------------------------

document.getElementById("go-community").addEventListener("click", () => {
    window.location.href = "/pages/community/";
});

