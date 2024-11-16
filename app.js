document.addEventListener('DOMContentLoaded', () => {
    // Progress Ring Animation
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    function setProgress(percent) {
        const offset = circumference - (percent / 100 * circumference);
        circle.style.strokeDashoffset = offset;
    }
    
    // Animate to 87%
    setProgress(87);

    // Cyber button effect
    const button = document.querySelector('.cyber-button');
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });

    // Add click animations to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Simulate real-time updates
    setInterval(() => {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const currentValue = parseFloat(stat.textContent);
            const newValue = currentValue + (Math.random() - 0.5) * 2;
            if (stat.textContent.includes('%')) {
                stat.textContent = newValue.toFixed(1) + '%';
            } else if (stat.textContent.includes('ms')) {
                stat.textContent = newValue.toFixed(1) + 'ms';
            } else {
                stat.textContent = Math.round(newValue) + 'K';
            }
        });
    }, 3000);
}); 