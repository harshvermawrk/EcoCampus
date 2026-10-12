// js/lab.js - Sustainable Lab & Educational Logic

const recyclingDatabase = [
    { item: 'Plastic Bottle', category: 'Plastic', action: 'Rinse and put in the dry recycling bin.' },
    { item: 'Cardboard Box', category: 'Paper', action: 'Flatten and recycle in paper waste.' },
    { item: 'Food Waste', category: 'Organic', action: 'Put in the campus compost bin.' },
    { item: 'Battery', category: 'Hazardous', action: 'Drop off at the e-waste collection box.' }
];

function initLabPage() {
    const root = document.getElementById('lab-root');
    if (!root) return;

    const resources = JSON.parse(localStorage.getItem('eco_resources')) || [];
    let totalWater = 0;
    let totalElectricity = 0;

    resources.forEach(record => {
        if (record.type === 'water') totalWater += Number(record.amount || 0);
        if (record.type === 'electricity') totalElectricity += Number(record.amount || 0);
    });

    root.innerHTML = `
        <div class="resource-stats" style="margin-bottom: 20px; display: flex; gap: 15px;">
            <div class="card" style="padding: 15px; background: #f4f4f4; border-radius: 8px; flex: 1;">
                <h3>Total Water Usage</h3>
                <p id="total-water-usage" style="font-size: 20px; font-weight: bold;">${totalWater} Litres</p>
            </div>
            <div class="card" style="padding: 15px; background: #f4f4f4; border-radius: 8px; flex: 1;">
                <h3>Total Electricity Usage</h3>
                <p id="total-electricity-usage" style="font-size: 20px; font-weight: bold;">${totalElectricity} kWh</p>
            </div>
        </div>
        
        <div class="recycling-section" style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <h3>♻️ Recycling Guide Search</h3>
            <input type="text" id="recycling-search" placeholder="Search item (e.g. Plastic, Battery)..." style="width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;">
            <div id="recycling-results" style="margin-top: 10px;"></div>
        </div>
    `;

    setupRecyclingSearch();
}

function setupRecyclingSearch() {
    const searchInput = document.getElementById('recycling-search');
    const resultsContainer = document.getElementById('recycling-results');

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === '') {
            resultsContainer.innerHTML = '';
            return;
        }

        const filtered = recyclingDatabase.filter(entry => 
            entry.item.toLowerCase().includes(query) || 
            entry.category.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<p>Koi matching item nahi mila.</p>';
            return;
        }

        resultsContainer.innerHTML = filtered.map(item => `
            <div class="recycling-card" style="background: #fff; padding: 10px; margin-top: 5px; border-radius: 4px; border: 1px solid #ddd;">
                <strong>${item.item} (${item.category})</strong>
                <p style="margin: 5px 0 0 0;">${item.action}</p>
            </div>
        `).join('');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLabPage();
});