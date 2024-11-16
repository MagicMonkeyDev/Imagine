document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-button');
    const menuItems = document.querySelectorAll('.menu-item');

    // Add click animation to start button
    startButton.addEventListener('click', () => {
        startButton.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            startButton.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    });

    // Add hover effect to menu items
    menuItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.2)';
        });

        item.addEventListener('mouseout', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1)';
        });
    });
}); 