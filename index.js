const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

console.log('🚀 AI Security Auditor starting...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV || 'development');

app.use(express.static('.'));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'AI Security Auditor'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/analyze/upload', (req, res) => {
    res.json({
        vulnerabilities: [
            {
                title: "Railway Deployment Success",
                severity: "Low", 
                line: 1,
                description: "AI Security Auditor is now running on Railway! Configure OpenAI API key for real GPT-5 analysis.",
                fix: "Add OPENAI_API_KEY environment variable in Railway dashboard"
            }
        ],
        summary: {
            total_vulnerabilities: 1,
            critical: 0,
            high: 0, 
            medium: 0,
            low: 1,
            risk_score: 85
        }
    });
});

app.post('/api/analyze/repo', (req, res) => {
    res.json({
        repository: req.body.url || 'demo-repo',
        files_analyzed: 3,
        vulnerabilities: [
            {
                title: "Demo Repository Analysis",
                severity: "Medium",
                line: 5,
                description: "This is a demo response. Configure OpenAI API for real analysis.",
                fix: "Set up proper API keys",
                file: "demo.js",
                file_path: "src/demo.js"
            }
        ],
        summary: {
            total_vulnerabilities: 1,
            critical: 0,
            high: 0,
            medium: 1, 
            low: 0,
            risk_score: 70
        }
    });
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on 0.0.0.0:${port}`);
    console.log('🌐 Railway deployment successful!');
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
});

process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated gracefully');
        process.exit(0);
    });
});