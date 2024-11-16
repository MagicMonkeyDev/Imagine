const DUNE_API_KEY = 'KjN3Vp6Vki0YVLcxF1UyFV0DdDHBs5zC';
const DUNE_API_BASE = 'https://api.dune.com/api/v1';

class DuneAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.headers = {
            'x-dune-api-key': apiKey
        };
    }

    async executeQuery(queryId) {
        try {
            const executeResponse = await fetch(`${DUNE_API_BASE}/query/${queryId}/execute`, {
                method: 'POST',
                headers: this.headers
            });
            
            if (!executeResponse.ok) {
                throw new Error(`Execute query failed: ${executeResponse.status}`);
            }
            
            const executeData = await executeResponse.json();
            return executeData.execution_id;
        } catch (error) {
            console.error('Error executing query:', error);
            return null;
        }
    }

    async getQueryResults(executionId) {
        try {
            const resultResponse = await fetch(`${DUNE_API_BASE}/execution/${executionId}/results`, {
                headers: this.headers
            });
            
            if (!resultResponse.ok) {
                throw new Error(`Get results failed: ${resultResponse.status}`);
            }
            
            const data = await resultResponse.json();
            return data.result?.rows || [];
        } catch (error) {
            console.error('Error getting results:', error);
            return [];
        }
    }

    async fetchQueryResults(queryId) {
        const executionId = await this.executeQuery(queryId);
        if (!executionId) return null;

        // Poll for results
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            const results = await this.getQueryResults(executionId);
            if (results.length > 0) {
                return results;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            attempts++;
        }
        
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const duneAPI = new DuneAPI(DUNE_API_KEY);

    // Query IDs for different metrics
    const QUERIES = {
        SOLANA_METRICS: '2984756', // Example query ID for Solana metrics
        TOKEN_VOLUMES: '2984757',  // Example query ID for token volumes
        TRADER_ACTIVITY: '2984758' // Example query ID for trader activity
    };

    async function updateDashboardData() {
        try {
            // Fetch Solana metrics
            const solanaMetrics = await duneAPI.fetchQueryResults(QUERIES.SOLANA_METRICS);
            if (solanaMetrics) {
                updateMetricsDisplay(solanaMetrics[0]); // Update header stats
            }

            // Fetch token volumes
            const tokenVolumes = await duneAPI.fetchQueryResults(QUERIES.TOKEN_VOLUMES);
            if (tokenVolumes) {
                updateVolumeChart(tokenVolumes);
            }

            // Fetch trader activity
            const traderActivity = await duneAPI.fetchQueryResults(QUERIES.TRADER_ACTIVITY);
            if (traderActivity) {
                updateActivityChart(traderActivity);
            }

        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    function updateMetricsDisplay(metrics) {
        // Update header stats with real data
        const stats = document.querySelectorAll('.stat-value');
        if (metrics) {
            stats[0].textContent = `$${metrics.sol_price?.toFixed(2) || '0.00'}`;
            stats[1].textContent = `${(metrics.volume || 0).toLocaleString()} SOL`;
            stats[2].textContent = (metrics.active_traders || 0).toLocaleString();
            stats[3].textContent = `${(metrics.success_rate || 0).toFixed(1)}%`;
        }
    }

    function updateVolumeChart(volumeData) {
        const volumeCtx = document.getElementById('volumeChart').getContext('2d');
        const labels = volumeData.map(item => item.token_symbol);
        const values = volumeData.map(item => item.volume);

        new Chart(volumeCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#00ff9d',
                        '#ff00ff',
                        '#00ffff',
                        '#ffaa00'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    function updateActivityChart(activityData) {
        const activityCtx = document.getElementById('activityChart').getContext('2d');
        const labels = activityData.map(item => item.day);
        const values = activityData.map(item => item.trader_count);

        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Active Traders',
                    data: values,
                    backgroundColor: '#00ff9d'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    // Initial update
    await updateDashboardData();

    // Update every 5 minutes
    setInterval(updateDashboardData, 5 * 60 * 1000);
}); 