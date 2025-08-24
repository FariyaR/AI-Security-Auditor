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
        
        // Extract code from JSON request
        if (req.body && req.body.code) {
            code = req.body.code;
        } else {
            code = 'No code provided for analysis';
        }

        const prompt = `You are a comprehensive security analysis expert. Analyze this code for ALL possible security vulnerabilities including:

1. SQL Injection
2. Cross-Site Scripting (XSS)
3. Command Injection
4. Path Traversal
5. Insecure Cryptography
6. Hardcoded Secrets
7. Authentication Bypass
8. Authorization Issues
9. Input Validation
10. Buffer Overflows
11. Race Conditions
12. Insecure Deserialization
13. XML External Entity (XXE)
14. Server-Side Request Forgery (SSRF)
15. Insecure Direct Object References
16. Security Misconfiguration
17. Sensitive Data Exposure
18. Insufficient Logging
19. Broken Access Control
20. Using Components with Known Vulnerabilities

Be thorough and find EVERY vulnerability, no matter how small. Return JSON:
{
  "vulnerabilities": [
    {
      "title": "Specific vulnerability name",
      "severity": "Critical|High|Medium|Low",
      "line": line_number,
      "description": "Detailed description of the security issue",
      "fix": "Specific remediation steps"
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

Code to analyze:
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