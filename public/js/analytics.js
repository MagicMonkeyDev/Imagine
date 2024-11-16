document.addEventListener('DOMContentLoaded', () => {
    // Mock data for charts
    const mockPriceData = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        prices: Array.from({length: 24}, () => 90 + Math.random() * 20)
    };

    // Price Action Chart
    const priceCtx = document.getElementById('tokenChart').getContext('2d');
    new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: mockPriceData.labels,
            datasets: [{
                label: 'Token Price',
                data: mockPriceData.prices,
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                fill: true,
                tension: 0.4
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
                        color: '#ffffff',
                        maxRotation: 0
                    }
                }
            }
        }
    });

    // Volume Distribution Chart
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    new Chart(volumeCtx, {
        type: 'doughnut',
        data: {
            labels: ['BONK', 'WEN', 'MYRO', 'Others'],
            datasets: [{
                data: [40, 25, 20, 15],
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

    // Trader Activity Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Active Traders',
                data: [1200, 1450, 1320, 1850, 1640, 1720, 1590],
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

    // Add recent activity items
    const activityList = document.querySelector('.activity-list');
    const recentActivities = [
        {
            token: 'BONK/SOL',
            change: '+127.5%',
            time: '2 hours ago',
            volume: '245K',
            users: '1.2K',
            success: true
        },
        {
            token: 'WEN/SOL',
            change: '+85.2%',
            time: '4 hours ago',
            volume: '180K',
            users: '950',
            success: true
        },
        {
            token: 'MYRO/SOL',
            change: '+92.8%',
            time: '6 hours ago',
            volume: '210K',
            users: '1.1K',
            success: true
        }
    ];

    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.success ? 'success' : 'failed'}`;
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-arrow-up"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.token}</h4>
                <p>${activity.change} in 4 minutes</p>
                <span class="activity-time">${activity.time}</span>
            </div>
            <div class="activity-stats">
                <span class="volume">Vol: ${activity.volume}</span>
                <span class="participants">Users: ${activity.users}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}); 