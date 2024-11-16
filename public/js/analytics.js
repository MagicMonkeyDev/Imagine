const DUNE_API_KEY = 'YOUR_API_KEY'; // Replace with your Dune API key
const DUNE_API_BASE = 'https://api.dune.com/api/v1';

class DuneAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.headers = {
            'x-dune-api-key': apiKey
        };
    }

    async fetchQuery(queryId) {
        try {
            // Execute query
            const executeResponse = await fetch(`${DUNE_API_BASE}/query/${queryId}/execute`, {
                method: 'POST',
                headers: this.headers
            });
            const executeData = await executeResponse.json();
            
            // Get results
            const resultResponse = await fetch(`${DUNE_API_BASE}/execution/${executeData.execution_id}/results`, {
                headers: this.headers
            });
            return await resultResponse.json();
        } catch (error) {
            console.error('Error fetching Dune data:', error);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const duneAPI = new DuneAPI(DUNE_API_KEY);

    // Fetch and update dashboard data
    async function updateDashboard() {
        // Fetch Solana metrics
        const solanaMetrics = await duneAPI.fetchQuery('YOUR_SOLANA_QUERY_ID');
        if (solanaMetrics) {
            updateSolanaStats(solanaMetrics);
        }

        // Fetch Pump.fun activity
        const pumpActivity = await duneAPI.fetchQuery('YOUR_PUMP_ACTIVITY_QUERY_ID');
        if (pumpActivity) {
            updatePumpActivity(pumpActivity);
        }

        // Update charts
        updateCharts();
    }

    function updateSolanaStats(data) {
        // Update header stats with real data
        document.getElementById('sol-price').textContent = `$${data.sol_price.toFixed(2)}`;
        document.getElementById('sol-volume').textContent = `${data.volume.toLocaleString()} SOL`;
        document.getElementById('active-traders').textContent = data.active_traders.toLocaleString();
        document.getElementById('successful-pumps').textContent = data.successful_pumps;
        
        // Update change indicators
        updateChangeIndicator('sol-change', data.price_change_24h);
        updateChangeIndicator('volume-change', data.volume_change_24h);
        updateChangeIndicator('traders-change', data.traders_change_24h);
        updateChangeIndicator('pump-rate', data.pump_success_rate);
    }

    function updateChangeIndicator(elementId, changeValue) {
        const element = document.getElementById(elementId);
        const isPositive = changeValue > 0;
        element.textContent = `${isPositive ? '+' : ''}${changeValue.toFixed(2)}%`;
        element.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
    }

    function updatePumpActivity(data) {
        const activityList = document.getElementById('pump-activity');
        activityList.innerHTML = ''; // Clear existing items

        data.recent_pumps.forEach(pump => {
            const activityItem = document.createElement('div');
            activityItem.className = `activity-item ${pump.success ? 'success' : 'failed'}`;
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${pump.success ? 'arrow-up' : 'arrow-down'}"></i>
                </div>
                <div class="activity-details">
                    <h4>${pump.token_symbol}</h4>
                    <p>${pump.price_change}% in ${pump.duration} minutes</p>
                    <span class="activity-time">${formatTimeAgo(pump.timestamp)}</span>
                </div>
                <div class="activity-stats">
                    <span class="volume">Vol: ${pump.volume} SOL</span>
                    <span class="participants">Users: ${pump.participants}</span>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    // Initialize dashboard
    await updateDashboard();
    
    // Update every 5 minutes
    setInterval(updateDashboard, 5 * 60 * 1000);
}); 