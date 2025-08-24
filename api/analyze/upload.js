const OpenAI = require('openai');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        let code = '';
        if (req.body) {
            if (typeof req.body === 'string') {
                code = req.body;
            } else if (req.body.code) {
                code = req.body.code;
            } else {
                code = JSON.stringify(req.body);
            }
        } else {
            code = 'No code provided';
        }

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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
        });

        let responseContent = completion.choices[0].message.content;
        
        // Extract JSON from markdown code blocks if present
        if (responseContent.includes('```json')) {
            const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                responseContent = jsonMatch[1];
            }
        } else if (responseContent.includes('```')) {
            const codeMatch = responseContent.match(/```[\s\S]*?([\s\S]*?)\s*```/);
            if (codeMatch) {
                responseContent = codeMatch[1];
            }
        }
        
        const result = JSON.parse(responseContent.trim());
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