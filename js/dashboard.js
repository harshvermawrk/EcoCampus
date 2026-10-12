// js/dashboard.js - Dashboard Business Logic

function updateDashboard() {
    const complaints = JSON.parse(localStorage.getItem('eco_complaints')) || [];
    const resources = JSON.parse(localStorage.getItem('eco_resources')) || [];

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    const root = document.getElementById('dashboard-root');
    if (!root) return;

    // HTML structure inject karna #dashboard-root ke andar
    root.innerHTML = `
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
            <div class="card" style="padding: 15px; background: #f4f4f4; border-radius: 8px;">
                <h3>Total Complaints</h3>
                <p id="total-complaints" style="font-size: 24px; font-weight: bold;">${totalComplaints}</p>
            </div>
            <div class="card" style="padding: 15px; background: #f4f4f4; border-radius: 8px;">
                <h3>Resolved</h3>
                <p id="resolved-complaints" style="font-size: 24px; font-weight: bold;">${resolvedComplaints}</p>
            </div>
            <div class="card" style="padding: 15px; background: #f4f4f4; border-radius: 8px;">
                <h3>Resolution Rate</h3>
                <p id="resolution-rate" style="font-size: 24px; font-weight: bold;">${resolutionRate}%</p>
            </div>
        </div>
        <div class="recommendations-section" style="background: #eef9ff; padding: 15px; border-radius: 8px;">
            <h3>💡 Sustainability Recommendations</h3>
            <div id="recommendations-container">
                ${generateRecommendationsList(complaints)}
            </div>
        </div>
    `;
}

function generateRecommendationsList(complaints) {
    let recommendations = [];
    const openWater = complaints.filter(c => c.category === 'water' && c.status !== 'Resolved').length;
    
    if (openWater > 0) {
        recommendations.push(`Paani se judi ${openWater} shikayatein abhi bhi pending hain. Jaldi action lein!`);
    }
    recommendations.push("Lab mein bijli ki khapat kam karne ke liye LED bulbs ka upyog karein.");

    return recommendations.map(rec => `<p class="rec-item" style="margin: 8px 0;">• ${rec}</p>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});