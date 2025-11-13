# 🧠 MindMate AI - AI-Powered Study Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?logo=openai)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MindMate AI is an intelligent study assistant that helps students learn more efficiently by leveraging artificial intelligence. Upload your study materials, generate summaries, create flashcards, take quizzes, and search academic papers - all in one beautiful interface.

## ✨ Features

### 📝 Smart Summarization
- **AI-Powered Summaries**: Get concise summaries of your study materials using OpenAI's GPT-4o-mini
- **Key Points Extraction**: Automatically identify and extract the most important concepts
- **Compression Statistics**: See how much your text has been condensed
- **Estimated Read Time**: Know how long it will take to review your summary

### 📁 File Upload Support
- **Multiple Formats**: Upload PDF, DOCX, or TXT files
- **Drag & Drop**: Simple drag-and-drop interface for quick uploads
- **Text Extraction**: Automatically extract text from uploaded documents
- **Visual Feedback**: Clear upload status with animated loading states

### 🎴 Interactive Flashcards
- **AI-Generated Q&A**: Automatically create study flashcards from your notes
- **3D Flip Animation**: Beautiful card flip animations for an engaging study experience
- **Difficulty Levels**: Cards tagged as Easy, Medium, or Hard
- **Persistent Storage**: Flashcards saved locally for future study sessions

### 🎯 Quiz Mode
- **Multiple Choice Questions**: Take interactive quizzes with 10 AI-generated questions
- **Timed Questions**: 30-second countdown per question to test your knowledge under pressure
- **Score Tracking**: Real-time score display and progress bar
- **Detailed Results**: Review answers with explanations after completion
- **Quiz History**: Track your past quiz attempts and performance trends

### 🔬 Research Mode
- **Academic Paper Search**: Search ArXiv database for relevant research papers
- **AI Summaries**: Get AI-generated summaries of paper abstracts
- **APA Citations**: Properly formatted citations ready to use
- **Direct Links**: Quick access to full papers on ArXiv

### 🔊 Text-to-Speech
- **Read Aloud**: Listen to your summaries with text-to-speech
- **Speed Controls**: Adjust playback speed (0.5x, 1x, 1.5x, 2x)
- **Pause/Resume**: Full playback controls

### 📋 Export & Share
- **Copy to Clipboard**: One-click copy of summaries and key points
- **Browser Storage**: Automatic saving of flashcards and quiz history

## 🛠️ Technologies Used

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with hooks and modern features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend & APIs
- **[OpenAI API](https://openai.com/)** - GPT-4o-mini for AI-powered features
- **[ArXiv API](https://arxiv.org/)** - Academic paper search and retrieval
- **Next.js API Routes** - Serverless API endpoints

### File Processing
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction
- **[mammoth](https://www.npmjs.com/package/mammoth)** - DOCX to text conversion
- **[react-dropzone](https://react-dropzone.js.org/)** - File upload interface
- **[xml2js](https://www.npmjs.com/package/xml2js)** - XML parsing for ArXiv data

### Additional Features
- **Web Speech API** - Browser-native text-to-speech
- **Local Storage API** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **OpenAI API Key** (get one at [platform.openai.com](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindmate-ai.git
   cd mindmate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📖 Usage Guide

### 1. Summarize Your Notes

1. Paste your text directly into the textarea or upload a file (PDF, DOCX, TXT)
2. Click "Summarize with AI"
3. View your summary, key points, and statistics

### 2. Generate Flashcards

1. Enter or upload your study material
2. Click "Flashcards" button
3. Click on any card to flip and reveal the answer
4. Flashcards are automatically saved for later review

### 3. Take a Quiz

1. Enter your study material
2. Click "Start Quiz"
3. Answer 10 multiple-choice questions
4. Review your results and explanations
5. Check your quiz history to track progress

### 4. Search Research Papers

1. Enter a search query in the "Research Academic Papers" section
2. Click the search icon
3. Browse AI-generated summaries of top papers
4. View full papers on ArXiv with one click

### 5. Listen to Summaries

1. Generate a summary first
2. Click "Read Aloud" in the Summary tab
3. Adjust speed using the dropdown menu
4. Use Pause/Resume and Stop controls as needed

## 🌐 Live Demo

<!-- Add your deployment link here after deploying -->
**Live Demo:** [Coming Soon](https://your-deployment-url.vercel.app)

## 📸 Screenshots

<!-- Add screenshots here -->
### Main Interface
![Main Interface](./screenshots/main-interface.png)
*Caption: Upload files or paste text to get started*

### Summary View
![Summary View](./screenshots/summary-view.png)
*Caption: AI-generated summaries with key points and statistics*

### Flashcards
![Flashcards](./screenshots/flashcards.png)
*Caption: Interactive flashcards with 3D flip animations*

### Quiz Mode
![Quiz Mode](./screenshots/quiz-mode.png)
*Caption: Timed multiple-choice questions with instant feedback*

### Research Papers
![Research Papers](./screenshots/research-papers.png)
*Caption: Search and explore academic papers from ArXiv*

> **Note:** Add screenshots to a `screenshots` folder in your repository

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository**

   Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/mindmate-ai.git
   cd mindmate-ai
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

   Go to the original repository and click "New Pull Request"

### Contribution Guidelines

- **Code Style**: Follow TypeScript and React best practices
- **Commits**: Use clear, descriptive commit messages
- **Testing**: Test your changes before submitting
- **Documentation**: Update README if you add new features
- **Issues**: Check existing issues before creating new ones

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌍 Internationalization (i18n)
- ⚡ Performance optimizations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Creator

**[Your Name]**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- **[OpenAI](https://openai.com/)** for providing the GPT-4o-mini API
- **[ArXiv](https://arxiv.org/)** for the open access to research papers
- **[Vercel](https://vercel.com/)** for hosting and deployment platform
- **[Next.js Team](https://nextjs.org/)** for the amazing React framework
- **[Tailwind Labs](https://tailwindcss.com/)** for the CSS framework

## 🗺️ Roadmap

### Coming Soon
- [ ] Markdown and PDF export functionality
- [ ] User authentication and cloud storage
- [ ] Collaborative study rooms
- [ ] Mobile app (React Native)
- [ ] More AI models support (Claude, Gemini)
- [ ] Study streak tracking and gamification
- [ ] Dark mode toggle
- [ ] Multi-language support

### Future Ideas
- [ ] Notion integration
- [ ] Google Drive sync
- [ ] Audio file transcription
- [ ] Study analytics dashboard
- [ ] Spaced repetition algorithm
- [ ] Community-shared flashcard decks

## 💬 Support

If you have any questions or need help:

- **Issues**: [Create an issue](https://github.com/yourusername/mindmate-ai/issues)
- **Discussions**: [Join the discussion](https://github.com/yourusername/mindmate-ai/discussions)
- **Email**: your.email@example.com

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/mindmate-ai&type=Date)](https://star-history.com/#yourusername/mindmate-ai&Date)

---

<div align="center">

**Made with ❤️ and ☕ by [Your Name]**

If you found this project helpful, please give it a ⭐!

[Report Bug](https://github.com/yourusername/mindmate-ai/issues) · [Request Feature](https://github.com/yourusername/mindmate-ai/issues) · [Live Demo](https://your-deployment-url.vercel.app)

</div>
