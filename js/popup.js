document.addEventListener("DOMContentLoaded", () => {

  console.log("popup.js chargé");

  const popup = document.getElementById("login-popup");
  const popupContent = document.querySelector(".popup-content");
  const discordBtn = document.getElementById("login-discord");
  const closeX = document.querySelector(".popup-close-x"); // la croix

  // Ouvrir le popup quand on clique sur CONNECT
  document.addEventListener("click", (e) => {
    if (e.target.id === "auth-btn" || e.target.closest("#auth-btn")) {
      console.log("CLICK CONNECT → ouverture popup");
      popup.classList.remove("hidden");
    }
  });

  // Fermer en cliquant sur la croix
  if (closeX) {
    closeX.addEventListener("click", () => {
      console.log("CLICK X → fermeture popup");
      popup.classList.add("hidden");
    });
  }

  // Fermer en cliquant en dehors du popup
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      console.log("CLICK OUTSIDE → fermeture popup");
      popup.classList.add("hidden");
    }
  });

  // Empêcher le clic dans le popup de fermer
  popupContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Connexion Discord
  discordBtn.addEventListener("click", () => {
    console.log("CLICK DISCORD → redirection");
    window.location.href = "http://localhost/api/discord-login.php";
  });

});
