const OpenAI = require('openai');
const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'Repository URL required' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
        });

        // Extract repo info from GitHub URL
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
            return res.status(400).json({ error: 'Invalid GitHub URL' });
        }

        const [, owner, repo] = match;
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
        
        // Get repository files
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'AI-Security-Auditor'
            }
        });

        const files = response.data.filter(file => 
            file.type === 'file' && 
            /\.(js|py|java|php|rb|go|rs|kt|cs|cpp|c)$/i.test(file.name)
        ).slice(0, 5);

        let allVulnerabilities = [];
        
        for (const file of files) {
            try {
                const fileResponse = await axios.get(file.download_url);
                const code = fileResponse.data.substring(0, 3000);

                const prompt = `Analyze this ${file.name} file for ALL security vulnerabilities. Be comprehensive and find every issue. Return JSON:
{
  "vulnerabilities": [
    {
      "title": "Vulnerability name",
      "severity": "Critical|High|Medium|Low",
      "line": line_number,
      "description": "Description",
      "fix": "How to fix"
    }
  ]
}

Code:
${code}`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.1
                });

                let responseContent = completion.choices[0].message.content;
                
                if (responseContent.includes('```json')) {
                    const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) {
                        responseContent = jsonMatch[1];
                    }
                }
                
                const result = JSON.parse(responseContent.trim());
                if (result.vulnerabilities) {
                    result.vulnerabilities.forEach(vuln => {
                        vuln.file = file.name;
                        vuln.file_path = file.path;
                    });
                    allVulnerabilities = allVulnerabilities.concat(result.vulnerabilities);
                }
            } catch (fileError) {
                console.error(`Error analyzing ${file.name}:`, fileError);
            }
        }

        const summary = {
            total_vulnerabilities: allVulnerabilities.length,
            critical: allVulnerabilities.filter(v => v.severity === 'Critical').length,
            high: allVulnerabilities.filter(v => v.severity === 'High').length,
            medium: allVulnerabilities.filter(v => v.severity === 'Medium').length,
            low: allVulnerabilities.filter(v => v.severity === 'Low').length,
            risk_score: Math.max(10, 100 - (allVulnerabilities.length * 10))
        };

        res.json({
            repository: url,
            files_analyzed: files.length,
            vulnerabilities: allVulnerabilities,
            summary
        });

    } catch (error) {
        console.error('Repository analysis error:', error);
        res.json({
            repository: req.body.url || 'error',
            files_analyzed: 0,
            vulnerabilities: [
                {
                    title: "Repository Analysis Error",
                    severity: "Medium",
                    line: 1,
                    description: `Error: ${error.message}. Add OPENAI_API_KEY to environment.`,
                    fix: "Configure OpenAI API key in Vercel dashboard",
                    file: "error.log",
                    file_path: "error.log"
                }
            ],
            summary: {
                total_vulnerabilities: 1,
                critical: 0,
                high: 0,
                medium: 1,
                low: 0,
                risk_score: 50
            }
        });
    }
};