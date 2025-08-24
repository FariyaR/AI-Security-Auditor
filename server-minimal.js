const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting minimal server...');
console.log('Port:', port);

// Basic middleware
app.use(express.static('.'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Basic API endpoint
app.post('/api/analyze/upload', (req, res) => {
    res.json({
        vulnerabilities: [
            {
                title: "Demo Vulnerability",
                severity: "Medium",
                line: 10,
                description: "This is a demo response - Railway deployment successful!",
                fix: "Configure OpenAI API key for real analysis"
            }
        ],
        summary: {
            total_vulnerabilities: 1,
            critical: 0,
            high: 0,
            medium: 1,
            low: 0,
            risk_score: 75
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Minimal server running on port ${port}`);
});