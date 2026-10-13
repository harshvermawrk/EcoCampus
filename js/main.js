
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const links = document.querySelectorAll(".nav-link");
  const pageNames = new Set(["dashboard", "complaints", "lab"]);

  function showPage(name) {
    if (!pageNames.has(name)) return;

    pages.forEach(page => {
      page.hidden = page.id !== `${name}-page`;
    });

    links.forEach(link => {
      const isCurrent = link.dataset.page === name;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
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

  const brand = document.querySelector(".brand");
  brand?.addEventListener("click", event => {
    event.preventDefault();
    showPage("dashboard");
  });

  showPage("dashboard");
});
