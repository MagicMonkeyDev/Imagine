document.addEventListener('DOMContentLoaded', () => {
    // Chart.js default configuration
    Chart.defaults.color = '#ffffff';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // Price Action Chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Price',
                data: generatePriceData(24),
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(16, 16, 23, 0.9)',
                    borderColor: '#00ff9d',
                    borderWidth: 1,
                    titleColor: '#00ff9d',
                    titleFont: {
                        family: 'Orbitron'
                    },
                    bodyFont: {
                        family: 'Rajdhani'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Rajdhani'
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Rajdhani'
                        },
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
            labels: ['BTC', 'ETH', 'Others'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: [
                    '#00ff9d',
                    '#ff00ff',
                    '#00ffff'
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
                        font: {
                            family: 'Rajdhani'
                        },
                        padding: 20
                    }
                }
            }
        }
    });

    // Success Rate Chart
    const successCtx = document.getElementById('successChart').getContext('2d');
    new Chart(successCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Success Rate',
                data: [85, 92, 88, 95, 89, 91, 87],
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
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Rajdhani'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Rajdhani'
                        }
                    }
                }
            }
        }
    });

    // Helper function to generate random price data
    function generatePriceData(points) {
        let basePrice = 100;
        return Array.from({length: points}, () => {
            basePrice += (Math.random() - 0.5) * 10;
            return basePrice;
        });
    }

    // Animate stats on load
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const value = parseFloat(stat.dataset.value);
        if (value) {
            let current = 0;
            const increment = value / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    clearInterval(timer);
                    current = value;
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 10);
        }
    });
}); 