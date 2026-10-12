
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const links = document.querySelectorAll(".nav-link");

  function showPage(name) {
    pages.forEach(page => {
      page.hidden = page.id !== `${name}-page`;
    });

    links.forEach(link => {
      link.classList.toggle("active", link.dataset.page === name);
    });

    if (name === "dashboard" &&
        typeof renderDashboard === "function") {
      renderDashboard();
    }

    if (name === "complaints" &&
        typeof renderComplaints === "function") {
      renderComplaints();
    }

    if (name === "lab" &&
        typeof renderLab === "function") {
      renderLab();
    }
  }

  links.forEach(link => {
    link.addEventListener("click", () => {
      showPage(link.dataset.page);
    });
  });

  document.querySelector(".brand").addEventListener("click", event => {
    event.preventDefault();
    showPage("dashboard");
  });

  showPage("dashboard");
});
