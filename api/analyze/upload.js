export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.json({
        vulnerabilities: [
            {
                title: "Vercel Deployment Success",
                severity: "Low",
                line: 1,
                description: "AI Security Auditor is now running on Vercel! Configure OpenAI API key for real GPT-5 analysis.",
                fix: "Add OPENAI_API_KEY environment variable in Vercel dashboard"
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
}