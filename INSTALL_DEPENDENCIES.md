# Installation Guide for MindMate AI

## Quick Start

Run this command in your terminal from the project root:

```bash
npm install
```

This will install all the required dependencies including:
- ✅ lucide-react (Icons)
- ✅ mammoth (DOCX parsing)
- ✅ pdf-parse (PDF text extraction)
- ✅ react-dropzone (File upload)
- ✅ xml2js (ArXiv XML parsing)
- ✅ openai (AI integration)

## Start Development Server

After installation, start the app:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## If You Get Errors

If you see "Module not found" errors after running npm install, try:

### 1. Clean install:
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### 2. Restart your development server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 3. If using VS Code, reload the TypeScript server:
- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type "TypeScript: Restart TS Server"
- Press Enter

## Environment Setup

Don't forget to set up your OpenAI API key:

1. Copy the example env file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

## Verify Installation

Check that packages are installed:

```bash
npm list lucide-react mammoth pdf-parse react-dropzone xml2js openai
```

## System Requirements

- Node.js 18+ (run `node --version`)
- npm 9+ (run `npm --version`)

## Troubleshooting

If issues persist:
1. Ensure you're in the correct directory (should see package.json)
2. Check your internet connection
3. Verify you have write permissions in the project folder
4. Make sure no antivirus is blocking npm

## Features Available

- ✅ AI-powered text summarization
- ✅ File upload (PDF, DOCX, TXT)
- ✅ Flashcard generation with flip animations
- ✅ Interactive quiz mode
- ✅ Research mode (ArXiv paper search)
- ✅ Text-to-speech for summaries
- ✅ Copy to clipboard

Note: PDF/Markdown export features have been temporarily removed due to dependency issues.
