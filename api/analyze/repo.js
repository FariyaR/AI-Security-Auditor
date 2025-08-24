module.exports = (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
};
}