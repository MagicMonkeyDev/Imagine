const express = require('express');
const app = express();

// Test route
app.get('/', (req, res) => {
    res.send('Test server running!');
});

// Try multiple ports
const tryPort = (port) => {
    app.listen(port, () => {
        console.log(`Server successfully running on port ${port}`);
        console.log(`Visit http://localhost:${port} to view`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}`);
            tryPort(port + 1);
        }
    });
};

// Start with port 3000
tryPort(3000); 