# AI Security Auditor - Node.js Edition

🚀 **EXACT REPLICA** of ULTIMATE_DEMO.html with Node.js backend - same look, same functionality, powered by Express.js and OpenAI GPT-5.

## Features

- **Node.js Backend**: Fast Express.js server with real-time analysis
- **GPT-5 Integration**: Advanced AI-powered vulnerability detection
- **GitHub Integration**: Scan entire repositories for security issues
- **Real-time Results**: Fast analysis with immediate feedback
- **File Upload**: Support for multiple programming languages
- **Security Scoring**: Risk assessment with detailed metrics

## Quick Start

### Prerequisites
- Node.js 16+ installed
- OpenAI API key (for GPT-5 analysis)
- GitHub token (optional, for repository analysis)

### Installation & Setup

1. **Clone or extract** this folder to your desktop
2. **Configure environment variables** in `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GITHUB_TOKEN=your_github_token_here
   PORT=8000
   ```
3. **Run the startup script**:
   ```bash
   start.bat
   ```

The script will:
- Install Node.js dependencies automatically
- Start the Express.js server on http://localhost:8000
- Open the web interface in your browser

### Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install

# Start the server
npm start
# or
node server.js
```

## API Endpoints

- `POST /api/analyze/upload` - Analyze uploaded files
- `POST /api/analyze/repo` - Analyze GitHub repository
- `GET /health` - Health check
- `GET /api/scans` - Get scan history
- `GET /api/dashboard/stats` - Dashboard statistics

## Supported File Types

- JavaScript (.js, .ts)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp)
- C# (.cs)
- Go (.go)
- PHP (.php)
- Ruby (.rb)
- Rust (.rs)
- Kotlin (.kt)

## Architecture

```
├── server.js          # Main Express.js server
├── package.json       # Node.js dependencies
├── index.html         # Frontend interface
├── .env              # Environment variables
├── start.bat         # Windows startup script
└── README.md         # This file
```

## Security Analysis

The system performs comprehensive security analysis including:

- SQL Injection detection
- Cross-Site Scripting (XSS)
- Command Injection
- Hardcoded secrets
- Weak cryptography
- Path traversal
- Authentication bypasses
- Input validation issues
- And 40+ other vulnerability types

## Performance

- **Fast Analysis**: Node.js async processing
- **Scalable**: Express.js handles multiple concurrent requests
- **Memory Efficient**: Optimized for large codebases
- **Real-time**: Immediate results via REST API

## Troubleshooting

### Common Issues

1. **"Node.js not found"**
   - Install Node.js from https://nodejs.org/
   - Restart your terminal/command prompt

2. **"Dependencies failed to install"**
   - Check your internet connection
   - Try: `npm cache clean --force`
   - Delete `node_modules` and run `npm install` again

3. **"OpenAI API error"**
   - Verify your API key in `.env`
   - Check your OpenAI account has GPT-5 access
   - Ensure you have sufficient API credits

4. **"GitHub API error"**
   - Add your GitHub token to `.env`
   - Verify the repository is public or you have access

### Port Issues

If port 8000 is in use, change it in `.env`:
```
PORT=3000
```

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon
npm run dev
```

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify your API keys are correctly configured
3. Ensure all dependencies are installed
4. Check that the server is running on the correct port

---

**Built with ❤️ using Node.js, Express.js, and OpenAI GPT-5**