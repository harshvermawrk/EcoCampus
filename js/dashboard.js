"use strict";

function renderDashboard() {
  const root = document.getElementById("dashboard-root");
  if (!root) return;

  let complaints;
  try {
    const data = getAppData();
    complaints = Array.isArray(data.complaints)
      ? data.complaints.filter(item => item && typeof item === "object")
      : [];
  } catch (error) {
    root.innerHTML = `
      <section class="panel" role="alert">
        <h2>Saved data could not be loaded</h2>
        <p>${escapeDashboardText(error.message)}</p>
      </section>
    `;
    return;
  }

  const isResolved = complaint => complaint.status === "resolved" ||
    complaint.status === "Resolved";
  const total = complaints.length;
  const resolved = complaints.filter(isResolved).length;
  const open = complaints.filter(item =>
    !isResolved(item) && item.status !== "in-progress"
  ).length;
  const inProgress = complaints.filter(item => item.status === "in-progress").length;

  root.innerHTML = `
    <div class="dashboard-intro">
      <h2>Campus sustainability overview</h2>
      <p>Track reported issues and the response status in this browser.</p>
    </div>

    <div class="dashboard-grid" aria-label="Complaint summary">
      <article class="metric-card">
        <span class="metric-label">Total complaints</span>
        <strong class="metric-value">${total}</strong>
      </article>
      <article class="metric-card metric-open">
        <span class="metric-label">Open</span>
        <strong class="metric-value">${open}</strong>
      </article>
      <article class="metric-card metric-progress">
        <span class="metric-label">In progress</span>
        <strong class="metric-value">${inProgress}</strong>
      </article>
      <article class="metric-card metric-resolved">
        <span class="metric-label">Resolved</span>
        <strong class="metric-value">${resolved}</strong>
      </article>
    </div>

    <section class="recommendations-section" aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading">💡 Sustainability tips</h2>
      ${generateRecommendationsList(complaints)}
    </section>

    <section class="panel" aria-labelledby="recent-reports-heading">
      <h2 id="recent-reports-heading">Recent campus reports</h2>
      <div id="recent-complaints" aria-live="polite"></div>
    </section>

    <p class="dashboard-note">
      Demo data is saved in this browser. Complaint counts are submitted reports,
      not independently measured environmental impact.
    </p>
  `;

  const recentRoot = root.querySelector("#recent-complaints");
  const recent = complaints
    .slice()
    .sort((first, second) => getComplaintTimestamp(second) - getComplaintTimestamp(first))
    .slice(0, 5);

  if (recent.length === 0) {
    recentRoot.innerHTML = '<p class="empty-state">No reports yet. The first campus issue can be added from the Green Complaint Box.</p>';
    return;
  }

  recentRoot.innerHTML = recent.map(item => {
    const title = escapeDashboardText(item.title || "Untitled report");
    const location = escapeDashboardText(item.location || "Location not provided");
    const { status, label } = getComplaintStatus(item.status);
    const dateValue = item.createdAt && !Number.isNaN(Date.parse(item.createdAt))
      ? new Date(item.createdAt).toISOString()
      : "";
    const dateLabel = dateValue
      ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(dateValue))
      : "Date unavailable";

    return `
      <article class="recent-report">
        <div class="recent-report-copy">
          <strong>${title}</strong>
          <p>${location}</p>
          <time datetime="${dateValue}">${dateLabel}</time>
        </div>
        <span class="status status-${status}">${label}</span>
      </article>
    `;
  }).join("");
}

function generateRecommendationsList(complaints) {
  const pendingWater = complaints.filter(item =>
    item.category === "water" && !["resolved", "Resolved"].includes(item.status)
  ).length;

  const recommendations = pendingWater > 0
    ? [
        `${pendingWater} water-related ${pendingWater === 1 ? "report is" : "reports are"} still unresolved. Check for leaks and report them promptly.`,
        "Switch off lights and fans in rooms that are not in use."
      ]
    : [
        "Turn off taps fully and report leaks when you find them.",
        "Switch off lights and fans in rooms that are not in use."
      ];

  return `<ul class="recommendation-list">${recommendations.map(tip => `<li>${tip}</li>`).join("")}</ul>`;
}

function getComplaintStatus(value) {
  if (value === "resolved" || value === "Resolved") {
    return { status: "resolved", label: "Resolved" };
  }
  if (value === "in-progress") {
    return { status: "in-progress", label: "In progress" };
  }
  return { status: "open", label: "Open" };
}

function getComplaintTimestamp(complaint) {
  const timestamp = Date.parse(complaint.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function escapeDashboardText(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
