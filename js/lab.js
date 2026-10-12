
const LAB_CHALLENGES_KEY = "ecocampus-lab-challenges-v1";

function renderLab() {
  const root = document.getElementById("lab-root");
  if (!root) return;

  let completed = [];

  try {
    const saved = JSON.parse(
      localStorage.getItem(LAB_CHALLENGES_KEY) || "[]"
    );

    if (Array.isArray(saved)) completed = saved;
  } catch (error) {
    console.error("Could not load saved lab challenges:", error);
  }

  const guides = [
    {
      icon: "♻️",
      category: "Waste Management",
      title: "Segregate Waste Correctly",
      description:
        "Separate waste at the source. Follow your campus's bin labels and local disposal rules.",
      tips: [
        "Keep clean paper, cardboard, metal and suitable plastic recyclables separate.",
        "Put food scraps in the designated wet-waste or compost bin.",
        "Never mix batteries, e-waste or chemicals with ordinary waste."
      ]
    },
    {
      icon: "💧",
      category: "Water Conservation",
      title: "Save Every Drop",
      description:
        "Small actions can reduce unnecessary water use across classrooms, hostels and washrooms.",
      tips: [
        "Turn taps off fully after use.",
        "Report leaking taps and overflowing water tanks.",
        "Use water carefully while cleaning and gardening."
      ]
    },
    {
      icon: "⚡",
      category: "Energy Conservation",
      title: "Use Electricity Wisely",
      description:
        "Reduce avoidable electricity use without compromising safety or essential campus work.",
      tips: [
        "Switch off lights and fans in empty rooms.",
        "Shut down lab equipment according to the lab's safety procedure.",
        "Use daylight when practical and safe."
      ]
    },
    {
      icon: "🌱",
      category: "Green Campus",
      title: "Build Greener Habits",
      description:
        "Choose reusable items and help your campus community adopt sustainable habits.",
      tips: [
        "Carry a reusable water bottle.",
        "Avoid unnecessary single-use plastic.",
        "Join campus clean-up, tree-care or recycling activities."
      ]
    }
  ];

  const challenges = [
    { id: "bottle", text: "Carry a reusable water bottle." },
    { id: "lights", text: "Switch off lights in an empty room." },
    { id: "waste", text: "Put waste in the correct labelled bin." },
    { id: "leak", text: "Report a water leak or overflowing tap." },
    { id: "plastic", text: "Avoid one unnecessary single-use plastic item." }
  ];

  root.innerHTML = `
    <section class="lab-hero">
      <span class="lab-hero-icon">🌍</span>
      <div>
        <h2>Your Guide to a Greener Campus</h2>
        <p>
          Learn practical ways to save water, conserve electricity
          and reduce waste at college.
        </p>
      </div>
    </section>

    <section class="lab-guides">
      ${guides.map(guide => `
        <article class="lab-card">
          <div class="lab-card-icon">${guide.icon}</div>
          <p class="lab-category">${guide.category}</p>
          <h3>${guide.title}</h3>
          <p>${guide.description}</p>
          <ul>
            ${guide.tips.map(tip => `<li>${tip}</li>`).join("")}
          </ul>
        </article>
      `).join("")}
    </section>

    <section class="panel lab-challenge-panel">
      <div class="lab-challenge-heading">
        <div>
          <h2>My Green Campus Challenge</h2>
          <p>Complete these simple actions to build greener habits.</p>
        </div>
        <span class="lab-progress" id="lab-progress">0 of 5</span>
      </div>

      <div class="lab-progress-track" aria-hidden="true">
        <div class="lab-progress-fill" id="lab-progress-fill"></div>
      </div>

      <div class="lab-challenge-list">
        ${challenges.map(challenge => `
          <label class="lab-challenge-item">
            <input
              type="checkbox"
              data-challenge-id="${challenge.id}"
              ${completed.includes(challenge.id) ? "checked" : ""}
            />
            <span>${challenge.text}</span>
          </label>
        `).join("")}
      </div>

      <p id="lab-challenge-message" role="status" aria-live="polite">
        Every small action helps!
      </p>
      <p class="lab-disclaimer">
        Challenge progress is saved only in this browser.
        It records self-reported actions, not independently verified impact.
      </p>
    </section>
  `;

  root.querySelectorAll("[data-challenge-id]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.challengeId;
      const currentlyCompleted = new Set();

      root.querySelectorAll("[data-challenge-id]:checked").forEach(item => {
        currentlyCompleted.add(item.dataset.challengeId);
      });

      const nextCompleted = Array.from(currentlyCompleted);

      try {
        localStorage.setItem(
          LAB_CHALLENGES_KEY,
          JSON.stringify(nextCompleted)
        );
      } catch (error) {
        console.error("Could not save challenge progress:", error);
      }

      updateLabProgress(root, nextCompleted.length, challenges.length);
    });
  });

  updateLabProgress(root, completed.length, challenges.length);
}

function updateLabProgress(root, count, total) {
  const progress = root.querySelector("#lab-progress");
  const fill = root.querySelector("#lab-progress-fill");
  const message = root.querySelector("#lab-challenge-message");

  if (progress) progress.textContent = `${count} of ${total} completed`;
  if (fill) fill.style.width = `${(count / total) * 100}%`;

  if (message) {
    message.textContent = count === total
      ? "Fantastic! You've completed every green challenge. 🌱"
      : count === 0
        ? "Every small action helps!"
        : "Nice work! Keep building greener habits.";
  }
}
