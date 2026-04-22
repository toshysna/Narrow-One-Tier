fetch("http://localhost/api/get_tierlists.php", { credentials: "include" })
  .then(res => res.json())
  .then(list => {
      const container = document.getElementById("community-container");
      container.innerHTML = "";

      if (list.length === 0) {
          container.innerHTML = "<div class='loading'>No tierlists shared yet.</div>";
          return;
      }

      list.forEach(t => {
          container.innerHTML += `
              <div class="tierlist-card">

                  <div class="type-tag">${t.type}</div>

                  <div class="author">
                      <img class="avatar" src="${t.avatar}" alt="avatar">
                      <div class="info">
                          <span class="username">${t.global_name || t.username}</span>
                          <span class="date">Updated on ${t.updated_at}</span>
                      </div>
                  </div>

                  <div class="tierlist-preview">
                      <img src="${t.data}" class="tierlist-image" alt="tierlist" />
                  </div>

              </div>
          `;
      });
  })
  .catch(err => {
      document.getElementById("community-container").innerHTML =
          "<div class='loading'>Failed to load tierlists.</div>";
  });
