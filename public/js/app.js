document.addEventListener('DOMContentLoaded', () => {
    // Card Hover Effects
    const cards = document.querySelectorAll('.feature-card');
    if (cards.length > 0) {
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
    }

    // Background Animation
    const background = document.querySelector('.background');
    if (background) {
        // Create matrix characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const streamCount = 50;
        const streams = [];

        class Stream {
            constructor(x) {
                this.x = x;
                this.y = -100;
                this.speed = Math.random() * 2 + 1;
                this.characters = [];
                this.length = Math.floor(Math.random() * 20 + 5);
                
                for (let i = 0; i < this.length; i++) {
                    this.characters.push({
                        char: chars[Math.floor(Math.random() * chars.length)],
                        opacity: Math.random()
                    });
                }
            }

            update() {
                this.y += this.speed;
                if (this.y > window.innerHeight + 100) {
                    this.y = -100;
                }

                // Randomly change characters
                if (Math.random() < 0.1) {
                    const index = Math.floor(Math.random() * this.length);
                    this.characters[index].char = chars[Math.floor(Math.random() * chars.length)];
                }

                // Update opacities
                this.characters.forEach(char => {
                    char.opacity += (Math.random() - 0.5) * 0.1;
                    char.opacity = Math.max(0.1, Math.min(1, char.opacity));
                });
            }
        }

        // Initialize streams
        for (let i = 0; i < streamCount; i++) {
            streams.push(new Stream(Math.random() * window.innerWidth));
        }

        // Create canvas for matrix effect
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        background.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Animation function
        function animate() {
            // Set canvas size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Clear canvas
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw streams
            ctx.font = '15px monospace';
            streams.forEach(stream => {
                stream.update();
                stream.characters.forEach((char, index) => {
                    ctx.fillStyle = `rgba(0, 255, 157, ${char.opacity})`;
                    ctx.fillText(
                        char.char, 
                        stream.x, 
                        stream.y + index * 20
                    );
                });
            });

            requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Button Hover Effects
    const buttons = document.querySelectorAll('.cyber-button');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });

    // Add glitch effect on card click
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('glitch');
            setTimeout(() => {
                this.classList.remove('glitch');
            }, 500);
        });
    });

    // Create floating particles
    const particleCount = 50;
    const particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
            if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
        }

        draw(ctx) {
            ctx.fillStyle = `rgba(0, 255, 157, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Create canvas for particles
    if (background) {
        const particleCanvas = document.createElement('canvas');
        particleCanvas.style.position = 'absolute';
        particleCanvas.style.top = '0';
        particleCanvas.style.left = '0';
        particleCanvas.style.width = '100%';
        particleCanvas.style.height = '100%';
        particleCanvas.style.zIndex = '-2';
        background.appendChild(particleCanvas);

        const particleCtx = particleCanvas.getContext('2d');

        // Particle animation function
        function animateParticles() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;

            particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw(particleCtx);
            });

            requestAnimationFrame(animateParticles);
        }

        // Start particle animation
        animateParticles();
    }
}); 
