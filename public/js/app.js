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

    // Add Matrix Rain Effect
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.classList.add('matrix-bg');
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    createMatrixRain();

    // Add hover effects for cards
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Add typing effect to cyber-text
    function typeEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }
        
        type();
    }

    document.querySelectorAll('.cyber-text').forEach(typeEffect);

    // Particle background
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const PARTICLE_COUNT = 400
    const CONNECT_DISTANCE = 80
    const FORCE_DISTANCE = 140

    const mouse = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight
    }

    let rafId = null

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
            this.vx = Math.random() * 2 - 1
            this.vy = Math.random() * 2 - 1
            this.radius = Math.random() * 1.5 + 0.5
        }

        update() {
            this.x += this.vx
            this.y += this.vy

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1

            // Mouse repulsion
            const dx = this.x - mouse.x
            const dy = this.y - mouse.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < FORCE_DISTANCE) {
                const force = (FORCE_DISTANCE - distance) / FORCE_DISTANCE
                this.vx += (dx / distance) * force * 0.6
                this.vy += (dy / distance) * force * 0.6
            }

            // Speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
            if (speed > 2) {
                this.vx = (this.vx / speed) * 2
                this.vy = (this.vy / speed) * 2
            }
        }

        draw() {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
    }

    const particles = Array(PARTICLE_COUNT).fill().map(() => new Particle())

    function animate() {
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#00ff9d'
        particles.forEach(particle => {
            particle.update()
            particle.draw()

            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x
                const dy = particle.y - otherParticle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < CONNECT_DISTANCE) {
                    ctx.strokeStyle = `rgba(0, 255, 157, ${1 - distance / CONNECT_DISTANCE})`
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(particle.x, particle.y)
                    ctx.lineTo(otherParticle.x, otherParticle.y)
                    ctx.stroke()
                }
            })
        })

        rafId = requestAnimationFrame(animate)
    }

    // Event listeners
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })

    // Start animation
    animate()
}); 