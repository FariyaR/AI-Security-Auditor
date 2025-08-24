const OpenAI = require('openai');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        let code = req.body.code || 'No code provided';

        const prompt = `Analyze this code for security vulnerabilities. Return JSON:
{
  "vulnerabilities": [
    {
      "title": "Vulnerability name",
      "severity": "Critical|High|Medium|Low",
      "line": line_number,
      "description": "Description",
      "fix": "How to fix"
    }
  ],
  "summary": {
    "total_vulnerabilities": number,
    "critical": number,
    "high": number,
    "medium": number,
    "low": number,
    "risk_score": number_0_to_100
  }
}

Code:
${code}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
        });

        const result = JSON.parse(completion.choices[0].message.content);
        res.json(result);

    } catch (error) {
        res.json({
            vulnerabilities: [
                {
                    title: "Analysis Error",
                    severity: "Medium",
                    line: 1,
                    description: `Error: ${error.message}. Add OPENAI_API_KEY to environment.`,
                    fix: "Configure OpenAI API key in Vercel dashboard"
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
    }
};