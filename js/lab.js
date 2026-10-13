"use strict";

const LAB_CHALLENGES_KEY = "ecocampus-lab-challenges-v1";

const recyclingDatabase = [
  { item: "Plastic bottle", category: "Plastic", action: "Rinse it and use the dry recycling bin." },
  { item: "Cardboard box", category: "Paper", action: "Flatten it and use the paper recycling bin." },
  { item: "Food scraps", category: "Organic", action: "Use the designated wet-waste or compost bin." },
  { item: "Battery", category: "Hazardous", action: "Take it to an e-waste collection point." }
];

const sustainabilityGuides = [
  {
    icon: "♻️",
    category: "Waste Management",
    title: "Sort waste at the source",
    description: "Follow your campus bin labels and local disposal guidance.",
    tips: [
      "Keep clean paper, cardboard, metal and recyclable plastic separate.",
      "Put food scraps in the designated wet-waste or compost bin.",
      "Keep batteries, e-waste and chemicals out of ordinary bins."
    ]
  },
  {
    icon: "💧",
    category: "Water Conservation",
    title: "Save every drop",
    description: "Small actions can reduce unnecessary water use around campus.",
    tips: [
      "Turn taps off fully after use.",
      "Report leaking taps and overflowing water tanks.",
      "Use water carefully while cleaning and gardening."
    ]
  },
  {
    icon: "⚡",
    category: "Energy Conservation",
    title: "Use electricity wisely",
    description: "Reduce avoidable electricity use while following safety procedures.",
    tips: [
      "Switch off lights and fans in empty rooms.",
      "Shut down lab equipment only according to lab safety procedures.",
      "Use daylight when practical and safe."
    ]
  },
  {
    icon: "🌱",
    category: "Green Campus",
    title: "Build greener habits",
    description: "Choose reusable items and help your campus community do the same.",
    tips: [
      "Carry a reusable water bottle.",
      "Avoid unnecessary single-use plastic.",
      "Join campus clean-up, tree-care or recycling activities."
    ]
  }
];

const greenChallenges = [
  { id: "bottle", text: "Carry a reusable water bottle." },
  { id: "lights", text: "Switch off lights in an empty room." },
  { id: "waste", text: "Put waste in the correct labelled bin." },
  { id: "leak", text: "Report a water leak or overflowing tap." },
  { id: "plastic", text: "Avoid one unnecessary single-use plastic item." }
];

function renderLab() {
  const root = document.getElementById("lab-root");
  if (!root) return;

  let appData;
  try {
    appData = getAppData();
  } catch (error) {
    root.innerHTML = `
      <section class="panel" role="alert">
        <h2>Saved data could not be loaded</h2>
        <p>${escapeLabText(error.message)}</p>
      </section>
    `;
    return;
  }

  const resources = Array.isArray(appData.resources) ? appData.resources : [];
  const totals = resources.reduce((result, record) => {
    const amount = Number(record?.amount);
    if (!Number.isFinite(amount) || amount <= 0) return result;
    if (record.type === "water") result.water += amount;
    if (record.type === "electricity") result.electricity += amount;
    return result;
  }, { water: 0, electricity: 0 });

  let completed = [];
  try {
    const saved = JSON.parse(localStorage.getItem(LAB_CHALLENGES_KEY) || "[]");
    if (Array.isArray(saved)) {
      const allowedIds = new Set(greenChallenges.map(challenge => challenge.id));
      completed = [...new Set(saved.filter(id => allowedIds.has(id)))];
    }
  } catch (error) {
    console.warn("Could not load saved challenge progress.", error);
  }

  root.innerHTML = `
    <section class="resource-section panel" aria-labelledby="resource-heading">
      <div class="section-heading">
        <div>
          <h2 id="resource-heading">Resource readings</h2>
          <p>Log demo readings to see totals saved in this browser.</p>
        </div>
      </div>

      <div class="resource-stats">
        <article class="resource-stat resource-stat-water">
          <span class="metric-label">Water recorded</span>
          <strong id="total-water-usage">${formatLabNumber(totals.water)} L</strong>
        </article>
        <article class="resource-stat resource-stat-electricity">
          <span class="metric-label">Electricity recorded</span>
          <strong id="total-electricity-usage">${formatLabNumber(totals.electricity)} kWh</strong>
        </article>
      </div>

      <form id="resource-form" class="resource-form">
        <div class="form-field">
          <label for="resource-type">Resource</label>
          <select id="resource-type" name="type" required>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
          </select>
        </div>
        <div class="form-field">
          <label id="resource-amount-label" for="resource-amount">Amount (litres)</label>
          <input id="resource-amount" name="amount" type="number" min="0.01" step="any" inputmode="decimal" required>
        </div>
        <div class="form-field">
          <label for="resource-date">Reading date</label>
          <input id="resource-date" name="date" type="date" value="${getLocalDateValue()}" required>
        </div>
        <button type="submit">Add reading</button>
        <p id="resource-message" class="form-message" role="status" aria-live="polite"></p>
      </form>

      <div class="resource-history">
        <h3>Recent readings</h3>
        <div id="resource-record-list"></div>
      </div>
    </section>

    <section class="panel recycling-section" aria-labelledby="recycling-heading">
      <h2 id="recycling-heading">♻️ Recycling guide</h2>
      <label for="recycling-search">Search by item or material</label>
      <input type="search" id="recycling-search" placeholder="Try “plastic” or “battery”" autocomplete="off">
      <div id="recycling-results" class="recycling-results" aria-live="polite"></div>
    </section>

    <section class="lab-hero">
      <span class="lab-hero-icon" aria-hidden="true">🌍</span>
      <div>
        <h2>Your guide to a greener campus</h2>
        <p>Practical ways to save water, conserve electricity and reduce waste.</p>
      </div>
    </section>

    <section class="lab-guides" aria-label="Sustainability guides">
      ${sustainabilityGuides.map(guide => `
        <article class="lab-card">
          <div class="lab-card-icon" aria-hidden="true">${guide.icon}</div>
          <p class="lab-category">${guide.category}</p>
          <h3>${guide.title}</h3>
          <p>${guide.description}</p>
          <ul>${guide.tips.map(tip => `<li>${tip}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </section>

    <section class="panel lab-challenge-panel" aria-labelledby="challenge-heading">
      <div class="lab-challenge-heading">
        <div>
          <h2 id="challenge-heading">My Green Campus Challenge</h2>
          <p>Complete these simple actions to build greener habits.</p>
        </div>
        <span class="lab-progress" id="lab-progress">0 of ${greenChallenges.length}</span>
      </div>

      <div
        class="lab-progress-track"
        id="lab-progress-track"
        role="progressbar"
        aria-label="Green challenge progress"
        aria-valuemin="0"
        aria-valuemax="${greenChallenges.length}"
        aria-valuenow="${completed.length}"
      >
        <div class="lab-progress-fill" id="lab-progress-fill"></div>
      </div>

      <div class="lab-challenge-list">
        ${greenChallenges.map(challenge => `
          <label class="lab-challenge-item ${completed.includes(challenge.id) ? "is-complete" : ""}">
            <input type="checkbox" data-challenge-id="${challenge.id}" ${completed.includes(challenge.id) ? "checked" : ""}>
            <span>${challenge.text}</span>
          </label>
        `).join("")}
      </div>

      <p id="lab-challenge-message" class="form-message" role="status" aria-live="polite">
        Every small action helps!
      </p>
    </section>
  `;

  setupResourceForm(root);
  renderResourceRecords(root, resources);
  setupRecyclingSearch(root);
  setupGreenChallenges(root, completed);
}

function setupResourceForm(root) {
  const form = root.querySelector("#resource-form");
  const typeSelect = root.querySelector("#resource-type");
  const amountLabel = root.querySelector("#resource-amount-label");
  if (!form || !typeSelect || !amountLabel) return;

  typeSelect.addEventListener("change", () => {
    amountLabel.textContent = typeSelect.value === "water"
      ? "Amount (litres)"
      : "Amount (kWh)";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      addResourceRecord({
        type: String(formData.get("type") || ""),
        amount: String(formData.get("amount") || ""),
        date: String(formData.get("date") || "")
      });
      renderLab();
      showLabMessage(root, "resource-message", "Reading saved.");
    } catch (error) {
      showLabMessage(root, "resource-message", error.message, true);
    }
  });
}

function renderResourceRecords(root, resources) {
  const list = root.querySelector("#resource-record-list");
  if (!list) return;

  const validRecords = resources
    .filter(record => record && ["water", "electricity"].includes(record.type))
    .filter(record => Number.isFinite(Number(record.amount)) && Number(record.amount) > 0)
    .sort((first, second) => String(second.date || "").localeCompare(String(first.date || "")))
    .slice(0, 8);

  if (validRecords.length === 0) {
    list.innerHTML = '<p class="empty-state">No readings yet. Add the first demo reading above.</p>';
    return;
  }

  list.innerHTML = `
    <ul class="resource-records">
      ${validRecords.map(record => {
        const isWater = record.type === "water";
        const value = formatLabNumber(Number(record.amount));
        const date = escapeLabText(formatLabDate(record.date));
        return `
          <li class="resource-record">
            <span>
              <strong>${isWater ? "Water" : "Electricity"}</strong>
              <time datetime="${escapeLabText(record.date || "")}">${date}</time>
            </span>
            <strong>${value} ${isWater ? "L" : "kWh"}</strong>
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function setupRecyclingSearch(root) {
  const searchInput = root.querySelector("#recycling-search");
  const results = root.querySelector("#recycling-results");
  if (!searchInput || !results) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      results.replaceChildren();
      return;
    }

    const matches = recyclingDatabase.filter(entry =>
      entry.item.toLowerCase().includes(query) ||
      entry.category.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      results.innerHTML = '<p class="empty-state">No matching item found.</p>';
      return;
    }

    results.innerHTML = matches.map(entry => `
      <article class="recycling-card">
        <h3>${entry.item} <span>(${entry.category})</span></h3>
        <p>${entry.action}</p>
      </article>
    `).join("");
  });
}

function setupGreenChallenges(root, initiallyCompleted) {
  root.querySelectorAll("[data-challenge-id]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const item = checkbox.closest(".lab-challenge-item");
      item?.classList.toggle("is-complete", checkbox.checked);
      const completed = Array.from(
        root.querySelectorAll("[data-challenge-id]:checked"),
        item => item.dataset.challengeId
      );

      try {
        localStorage.setItem(LAB_CHALLENGES_KEY, JSON.stringify(completed));
        updateLabProgress(root, completed.length, greenChallenges.length);
      } catch (error) {
        checkbox.checked = !checkbox.checked;
        item?.classList.toggle("is-complete", checkbox.checked);
        const savedCount = root.querySelectorAll("[data-challenge-id]:checked").length;
        updateLabProgress(root, savedCount, greenChallenges.length);
        showLabMessage(root, "lab-challenge-message", "Could not save progress in this browser.", true);
      }
    });
  });

  updateLabProgress(root, initiallyCompleted.length, greenChallenges.length);
}

function updateLabProgress(root, count, total) {
  const progress = root.querySelector("#lab-progress");
  const track = root.querySelector("#lab-progress-track");
  const fill = root.querySelector("#lab-progress-fill");
  const message = root.querySelector("#lab-challenge-message");
  const safeCount = Math.min(Math.max(count, 0), total);

  if (progress) progress.textContent = `${safeCount} of ${total} completed`;
  if (track) track.setAttribute("aria-valuenow", String(safeCount));
  if (fill) fill.style.width = `${total ? (safeCount / total) * 100 : 0}%`;

  if (message) {
    message.textContent = safeCount === total
      ? "Great work! You have completed every green challenge. 🌱"
      : safeCount === 0
        ? "Every small action helps!"
        : "Nice work! Keep building greener habits.";
    message.classList.remove("message-error");
  }
}

function showLabMessage(root, id, message, isError = false) {
  const element = root.querySelector(`#${id}`);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("message-error", isError);
}

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLabDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatLabNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function escapeLabText(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
