'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, File, Trash2, Loader2, Pause,
  Play, Copy, BookOpen, Search, ExternalLink
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SummaryResult {
  summary: string
  keyPoints: string[]
  originalLength: number
  summaryLength: number
  compressionRate: number
  estimatedReadTime: number
}

interface UploadedFile {
  name: string
  type: string
}

interface Flashcard {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  published: number
  abstract: string
  aiSummary: string
  citation: string
  url: string
}

export default function Home() {
  const router = useRouter()
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'keyPoints' | 'flashcards' | 'research'>('summary')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Research mode state
  const [searchQuery, setSearchQuery] = useState('')
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('mindmate-flashcards')
    if (savedFlashcards) {
      try {
        setFlashcards(JSON.parse(savedFlashcards))
      } catch (e) {
        console.error('Failed to load flashcards:', e)
      }
    }
  }, [])

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('mindmate-flashcards', JSON.stringify(flashcards))
    }
  }, [flashcards])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract text from file')
      }

      const data = await response.json()
      setInputText(data.text)
      setUploadedFile({
        name: data.fileName,
        type: data.fileType,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setInputText('')
  }

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to summarize text')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate flashcards')
      return
    }

    setIsGeneratingFlashcards(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data.flashcards)
      setActiveTab('flashcards')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGeneratingFlashcards(false)
    }
  }

  const flipCard = (index: number) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(index)) {
      newFlipped.delete(index)
    } else {
      newFlipped.add(index)
    }
    setFlippedCards(newFlipped)
  }

  // Text-to-speech functions
  const handleSpeak = () => {
    if (!result?.summary) return

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      return
    }

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(result.summary)
    utterance.rate = speechRate
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate)
    if (isSpeaking && utteranceRef.current) {
      handleStopSpeaking()
      handleSpeak()
    }
  }

  // Export functions
  const copyToClipboard = async () => {
    if (!result) return

    const text = `Summary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`

    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Research functions
  const handleSearchPapers = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch('/api/search-papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search papers')
      }

      const data = await response.json()
      setResearchPapers(data.papers)
      setActiveTab('research')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSearching(false)
    }
  }

  const handleStartQuiz = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate a quiz')
      return
    }

    // Store the text in sessionStorage so the quiz page can use it
    sessionStorage.setItem('mindmate-quiz-text', inputText)
    router.push('/quiz')
  }

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <File className="w-4 h-4 text-red-500" />
    if (fileType === 'docx') return <FileText className="w-4 h-4 text-blue-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return 'bg-green-100 text-green-700'
    if (difficulty === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            🧠 MindMate AI
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            AI-powered study assistant to help you summarize and understand your notes
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Notes</h2>
              <span className="text-sm text-gray-500">{wordCount} words</span>
            </div>

            {/* File Upload Dropzone */}
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`mb-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                      <p className="text-sm text-gray-600">Processing file...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      {isDragActive ? (
                        <p className="text-sm text-blue-600 font-medium">Drop your file here</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700 font-medium mb-1">
                            Upload a file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOCX, or TXT up to 10MB
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4 border-2 border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">File uploaded successfully</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}

            <div className="relative mb-4">
              <div className="absolute top-3 left-3 text-xs text-gray-400">
                {uploadedFile ? 'Extracted text:' : 'Or paste text directly:'}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text, notes, or study materials here..."
                className="w-full h-80 pt-10 pb-4 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Summarizing...
                  </span>
                ) : (
                  'Summarize with AI'
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={isGeneratingFlashcards || !inputText.trim()}
                  className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isGeneratingFlashcards ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Flashcards
                    </span>
                  )}
                </button>

                <button
                  onClick={handleStartQuiz}
                  disabled={!inputText.trim()}
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Start Quiz
                </button>
              </div>
            </div>

            {/* Research Mode */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Research Academic Papers</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ArXiv papers..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchPapers()}
                />
                <button
                  onClick={handleSearchPapers}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Results</h2>

              {/* Copy button */}
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            {!result && flashcards.length === 0 && researchPapers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-center">
                  Your AI-generated content will appear here
                </p>
              </div>
            ) : (
              <>
                {result && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">Compression</p>
                      <p className="text-2xl font-bold text-blue-700">{result.compressionRate}%</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-600 font-medium">Key Points</p>
                      <p className="text-2xl font-bold text-purple-700">{result.keyPoints.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium">Read Time</p>
                      <p className="text-2xl font-bold text-green-700">{result.estimatedReadTime} min</p>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                  {result && (
                    <>
                      <button
                        onClick={() => setActiveTab('summary')}
                        className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          activeTab === 'summary'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Summary
                      </button>
                      <button
                        onClick={() => setActiveTab('keyPoints')}
                        className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          activeTab === 'keyPoints'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Key Points
                      </button>
                    </>
                  )}
                  {flashcards.length > 0 && (
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === 'flashcards'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Flashcards ({flashcards.length})
                    </button>
                  )}
                  {researchPapers.length > 0 && (
                    <button
                      onClick={() => setActiveTab('research')}
                      className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === 'research'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Research ({researchPapers.length})
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                  {activeTab === 'summary' && result && (
                    <div>
                      {/* Text-to-speech controls */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                        <button
                          onClick={handleSpeak}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          {isSpeaking && !isPaused ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {isSpeaking && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Read Aloud'}
                        </button>

                        {isSpeaking && (
                          <button
                            onClick={handleStopSpeaking}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Stop
                          </button>
                        )}

                        <select
                          value={speechRate}
                          onChange={(e) => handleSpeechRateChange(Number(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'keyPoints' && result && (
                    <ul className="space-y-3">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'flashcards' && flashcards.length > 0 && (
                    <div className="space-y-4">
                      {flashcards.map((card, index) => (
                        <div
                          key={index}
                          onClick={() => flipCard(index)}
                          className="relative h-48 cursor-pointer"
                          style={{ perspective: '1000px' }}
                        >
                          <div
                            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                              flippedCards.has(index) ? 'rotate-y-180' : ''
                            }`}
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: flippedCards.has(index) ? 'rotateY(180deg)' : 'rotateY(0)',
                            }}
                          >
                            {/* Front */}
                            <div
                              className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 flex flex-col justify-between shadow-lg"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(card.difficulty)}`}>
                                  {card.difficulty}
                                </span>
                                <span className="text-white text-xs">Click to flip</span>
                              </div>
                              <p className="text-white text-lg font-medium text-center">
                                {card.question}
                              </p>
                              <div className="text-center text-white text-xs">Question</div>
                            </div>

                            {/* Back */}
                            <div
                              className="absolute w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 flex flex-col justify-between shadow-lg"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                              }}
                            >
                              <span className="text-white text-xs text-right">Click to flip back</span>
                              <p className="text-white text-lg text-center">
                                {card.answer}
                              </p>
                              <div className="text-center text-white text-xs">Answer</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'research' && researchPapers.length > 0 && (
                    <div className="space-y-4">
                      {researchPapers.map((paper) => (
                        <div key={paper.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-gray-800 mb-2">{paper.title}</h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {paper.authors.slice(0, 3).join(', ')}
                            {paper.authors.length > 3 && ', et al.'} ({paper.published})
                          </p>
                          <p className="text-sm text-gray-700 mb-3">{paper.aiSummary}</p>
                          <details className="mb-3">
                            <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                              Show Citation (APA)
                            </summary>
                            <p className="text-xs text-gray-600 mt-2 italic">{paper.citation}</p>
                          </details>
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            View Paper <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
