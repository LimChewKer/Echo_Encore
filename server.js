const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS, etc.)
app.use(express.static(__dirname));

// Handle form submissions
app.post('/contribute', (req, res) => {
    const { name, email, contribution } = req.body;

    // Prepare the contribution data to save
    const newContribution = `Name: ${name}, Email: ${email}, Contribution: ${contribution}\n`;

    // Append the contribution to contributes.txt
    fs.appendFile(path.join(__dirname, 'contributes.txt'), newContribution, (err) => {
        if (err) {
            console.error('Failed to save contribution:', err);
            return res.status(500).send('Failed to save contribution');
        }
        res.send('Contribution saved successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
