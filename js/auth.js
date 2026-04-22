fetch("http://localhost/api/me.php", { credentials: "include" })
  .then(res => res.json())
  .then(data => {
      const btn = document.getElementById("auth-btn");
      const text = document.getElementById("auth-btn-text");

      if (!btn || !text) return;

      if (data.authenticated) {
          text.textContent = "LOGOUT";
          btn.addEventListener("click", () => {
              window.location.href = "http://localhost/logout.php";
          });
      } else {
          text.textContent = "LOGIN";
          btn.addEventListener("click", () => {
             document.getElementById("login-popup").classList.remove("hidden");
          });
      }
  });
