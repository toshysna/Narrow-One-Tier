document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("left-buttons");
  if (!nav) return;

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
});
