// js/dashboard.js - Dashboard Business Logic

function renderDashboard() {
  const root = document.getElementById("dashboard-root");
  if (!root) return;

  const data = getAppData();
  const complaints = data.complaints || [];

  const total = complaints.length;
  const open = complaints.filter(
    item => (item.status || "open") === "open"
  ).length;
  const inProgress = complaints.filter(
    item => item.status === "in-progress"
  ).length;
  const resolved = complaints.filter(
    item => item.status === "resolved" || item.status === 'Resolved'
  ).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  root.innerHTML = `
    <div class="dashboard-intro">
      <h2>Campus Sustainability Overview</h2>
      <p>Track reported sustainability issues and campus action.</p>
    </div>

    <div class="dashboard-grid">
      <article class="metric-card">
        <span class="metric-label">Total Complaints</span>
        <strong class="metric-value">${total}</strong>
      </article>

      <article class="metric-card metric-open">
        <span class="metric-label">Open</span>
        <strong class="metric-value">${open}</strong>
      </article>

      <article class="metric-card metric-progress">
        <span class="metric-label">In Progress</span>
        <strong class="metric-value">${inProgress}</strong>
      </article>

      <article class="metric-card metric-resolved">
        <span class="metric-label">Resolved</span>
        <strong class="metric-value">${resolved}</strong>
      </article>
    </div>

    <div class="recommendations-section" style="background: #eef9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3>💡 Sustainability Recommendations</h3>
        <div id="recommendations-container">
            ${generateRecommendationsList(complaints)}
        </div>
    </div>

    <section class="panel">
      <h2>Recent Campus Reports</h2>
      <div id="recent-complaints"></div>
    </section>

    <p class="dashboard-note">
      Demo data is stored in this browser. These figures represent
      submitted reports, not independently measured environmental impact.
    </p>
  `;

  const recentRoot = document.getElementById("recent-complaints");
  const recent = complaints.slice().reverse().slice(0, 5);

  if (recent.length === 0) {
    recentRoot.innerHTML = "<p>No reports yet. Submit the first campus issue!</p>";
    return;
  }

  recentRoot.innerHTML = recent.map(item => {
    const title = escapeDashboardText(item.title);
    const location = escapeDashboardText(item.location);
    const status = item.status || "open";
    const label = {
      open: "Open",
      "in-progress": "In Progress",
      resolved: "Resolved",
      Resolved: "Resolved"
    }[status] || "Open";

    return `
      <div class="recent-report">
        <div>
          <strong>${title}</strong>
          <p>${location}</p>
        </div>
        <span class="status status-${status.toLowerCase()}">${label}</span>
      </div>
    `;
  }).join("");
}

function generateRecommendationsList(complaints) {
    let recommendations = [];
    const openWater = complaints.filter(c => c.category === 'water' && c.status !== 'resolved' && c.status !== 'Resolved').length;
    
    if (openWater > 0) {
        recommendations.push(`Paani se judi ${openWater} shikayatein abhi bhi pending hain. Jaldi action lein!`);
    }
    recommendations.push("Lab mein bijli ki khapat kam karne ke liye LED bulbs ka upyog karein.");

    return recommendations.map(rec => `<p class="rec-item" style="margin: 8px 0;">• ${rec}</p>`).join('');
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

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});