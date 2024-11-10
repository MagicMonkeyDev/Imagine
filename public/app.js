async function loadThoughts() {
    try {
        const response = await fetch('/api/thoughts');
        const thoughts = await response.json();
        const container = document.getElementById('thoughts-container');
        container.innerHTML = thoughts.map(thought => `
            <div class="thought-card">
                <div class="thought-content">${thought.content}</div>
                <div class="thought-meta">
                    <span>${new Date(thought.timestamp).toLocaleString()}</span>
                    <button class="upvote-btn" onclick="upvoteThought(${thought.id})">
                        ⬆️ ${thought.upvotes}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading thoughts:', error);
    }
}

async function upvoteThought(id) {
    try {
        await fetch(`/api/thoughts/upvote/${id}`, { method: 'POST' });
        loadThoughts(); // Reload thoughts to update counts
    } catch (error) {
        console.error('Error upvoting thought:', error);
    }
}

// Load thoughts initially and every 30 seconds
loadThoughts();
setInterval(loadThoughts, 30000); 