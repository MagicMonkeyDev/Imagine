class ApocalypseJournal {
    constructor() {
        this.popularContainer = document.querySelector('#popular-entries .entries-container');
        this.recentContainer = document.querySelector('#recent-entries .entries-container');
        this.countdownElement = document.getElementById('countdown');
        this.countdown = 300; // 5 minutes in seconds
        
        this.init();
    }

    async init() {
        await this.loadEntries();
        this.startCountdown();
        this.startJournalGeneration();
    }

    async loadEntries() {
        try {
            // Load popular entries
            const popularResponse = await fetch('/api/entries/popular');
            const popularEntries = await popularResponse.json();
            this.renderEntries(popularEntries, this.popularContainer);

            // Load recent entries
            const recentResponse = await fetch('/api/entries/recent');
            const recentEntries = await recentResponse.json();
            this.renderEntries(recentEntries, this.recentContainer);
        } catch (error) {
            console.error('Failed to load entries:', error);
        }
    }

    renderEntries(entries, container) {
        container.innerHTML = entries.map(entry => `
            <div class="entry" data-id="${entry.id}">
                <div class="entry-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                <div class="entry-content">${entry.content}</div>
                <div class="entry-votes">
                    <button class="vote-button" onclick="journal.vote(${entry.id}, 1)">↑</button>
                    <span class="vote-count">${entry.votes}</span>
                    <button class="vote-button" onclick="journal.vote(${entry.id}, -1)">↓</button>
                </div>
            </div>
        `).join('');
    }

    async generateEntry() {
        try {
            const response = await fetch('/api/entries/generate', {
                method: 'POST'
            });
            const newEntry = await response.json();
            
            // Add new entry to recent container
            const entryElement = document.createElement('div');
            entryElement.className = 'entry';
            entryElement.innerHTML = this.renderEntries([newEntry], document.createElement('div'));
            
            this.recentContainer.insertBefore(entryElement, this.recentContainer.firstChild);
        } catch (error) {
            console.error('Failed to generate entry:', error);
        }
    }

    startCountdown() {
        this.countdown = 300; // Reset countdown to 5 minutes
        this.updateCountdown();
        this.countdownInterval = setInterval(this.updateCountdown.bind(this), 1000);
    }

    updateCountdown() {
        const minutes = Math.floor(this.countdown / 60);
        const seconds = this.countdown % 60;
        this.countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.countdown--;
        if (this.countdown < 0) {
            clearInterval(this.countdownInterval);
            this.generateEntry();
            this.startCountdown();
        }
    }

    startJournalGeneration() {
        // Implement journal generation logic here
    }

    vote(entryId, vote) {
        // Implement vote logic here
    }
}

const journal = new ApocalypseJournal(); 