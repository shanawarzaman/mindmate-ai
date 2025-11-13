# Contributing to MindMate AI

First off, thank you for considering contributing to MindMate AI! It's people like you that make MindMate AI such a great tool for students worldwide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and considerate of others.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Push to your fork
6. Submit a pull request

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description** of the enhancement
- **Use case** explaining why this would be useful
- **Proposed implementation** if you have ideas

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues that need assistance

## Development Setup

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- OpenAI API key

### Setup Steps

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
   ```bash
   cp .env.local.example .env.local
   # Add your OpenAI API key to .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Run tests** (when available)
   ```bash
   npm test
   ```

## Pull Request Process

1. **Update documentation** if you're adding/changing features
2. **Test your changes** thoroughly
3. **Update the README.md** if needed
4. **Follow the coding standards** outlined below
5. **Write clear commit messages**
6. **Request review** from maintainers

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested on different browsers (if UI changes)
- [ ] Screenshots added (if UI changes)

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define interfaces for props and data structures
- Avoid `any` type when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow existing color schemes and spacing
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### File Structure

```
app/
├── api/                  # API routes
│   ├── summarize/
│   ├── generate-flashcards/
│   └── ...
├── quiz/                 # Quiz page
├── page.tsx             # Main page
├── layout.tsx           # Root layout
└── globals.css          # Global styles
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(flashcards): add difficulty filter

Add ability to filter flashcards by difficulty level.
Users can now show only easy, medium, or hard cards.

Closes #123
```

```bash
fix(quiz): correct timer reset issue

Timer was not resetting properly between questions.
Fixed by clearing the interval before setting a new one.
```

```bash
docs(readme): update installation instructions

Add troubleshooting section for common npm errors.
```

## Testing

### Manual Testing

Before submitting a PR, test:
- [ ] All features work as expected
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Works in Chrome, Firefox, Safari
- [ ] Loading states display correctly
- [ ] Error messages are clear

### Test Scenarios

1. **Summarization**
   - Test with short and long text
   - Test with special characters
   - Test with non-English text

2. **File Upload**
   - Test PDF, DOCX, TXT files
   - Test drag and drop
   - Test file removal

3. **Flashcards**
   - Generate flashcards
   - Flip cards
   - Check localStorage persistence

4. **Quiz**
   - Take full quiz
   - Test timer functionality
   - Check score calculation
   - Review answers

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in GitHub Discussions
- Contact the maintainers directly

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special thanks in project announcements

Thank you for contributing to MindMate AI! 🎉
