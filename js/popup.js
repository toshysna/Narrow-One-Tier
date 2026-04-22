
document.addEventListener("DOMContentLoaded", () => {

  console.log("popup.js chargé"); // TEST IMPORTANT

  // Ouvrir le popup quand on clique sur CONNECT
  document.addEventListener("click", (e) => {
    if (e.target.id === "auth-btn" || e.target.closest("#auth-btn")) {
      console.log("CLICK CONNECT → ouverture popup");
      document.getElementById("login-popup").classList.remove("hidden");
    }
  });

  // Fermer le popup
  document.getElementById("close-popup").addEventListener("click", () => {
    console.log("CLICK FERMER → fermeture popup");
    document.getElementById("login-popup").classList.add("hidden");
  });

  // Connexion Discord
  document.getElementById("login-discord").addEventListener("click", () => {
    console.log("CLICK DISCORD → redirection");
    window.location.href = "http://localhost/api/discord-login.php";
  });

});
