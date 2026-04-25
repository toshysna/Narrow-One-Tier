document.addEventListener("DOMContentLoaded", () => {
  console.log("[nav.js] DOM chargé");

  // NAV GAUCHE
  const nav = document.getElementById("left-buttons");
  console.log("[nav.js] left-buttons =", nav);

  if (nav) {
    console.log("[nav.js] Injection NAV GAUCHE");
    nav.innerHTML = `
      <div class="button-group">
        <div class="text-left-button">MAP</div>
        <a href="/pages/map-tierlist/" class="nav-button">
          <img src="/assets/icons/map.png" alt="Map" />
        </a>
      </div>

      <div class="button-group">
        <div class="text-left-button">BOW</div>
        <a href="/pages/bow-tierlist/" class="nav-button">
          <img src="/assets/icons/bow.png" alt="Bow" />
        </a>
      </div>

      <div class="button-group">
        <div class="text-left-button">MELEE</div>
        <a href="/pages/melee-tierlist/" class="nav-button">
          <img src="/assets/icons/melee.png" alt="Melee" />
        </a>
      </div>

      <div class="button-group">
        <div class="text-left-button">ARROW</div>
        <a href="/pages/arrow-tierlist/" class="nav-button">
          <img src="/assets/icons/arrow.png" alt="Arrow" />
        </a>
      </div>

      <div class="button-group">
        <div class="text-left-button">SKIN</div>
        <a href="/pages/skin-tierlist/" class="nav-button">
          <img src="/assets/icons/skin.png" alt="Skin" />
        </a>
      </div>
    `;
  }

  // NAV DROITE — BOUTON LOGIN
const authContainer = document.getElementById("auth-button");
console.log("[nav.js] auth-button =", authContainer);

if (authContainer) {
  console.log("[nav.js] Injection BOUTON LOGIN");
 authContainer.innerHTML = `
  <button id="auth-btn" class="nav-button">
    <img src="/assets/icons/login.png" alt="login" />
    <div class="text-right-button" id="auth-btn-text">LOGIN</div>
  </button>
`;

}
const communityBtn = document.getElementById("community-btn");

if (communityBtn) {
  communityBtn.addEventListener("click", () => {
    window.location.href = "/pages/community/";
  });
}

console.log("[nav.js] auth-btn après injection =", document.getElementById("auth-btn"));

const script = document.createElement("script");
script.src = "/js/auth.js";
document.body.appendChild(script);
console.log("[nav.js] auth.js chargé dynamiquement");

});

