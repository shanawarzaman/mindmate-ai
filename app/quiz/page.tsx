'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Clock, CheckCircle, XCircle, ArrowLeft, BarChart3 } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizHistory {
  date: string
  score: number
  total: number
  percentage: number
}

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load quiz history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('mindmate-quiz-history')
    if (history) {
      try {
        setQuizHistory(JSON.parse(history))
      } catch (e) {
        console.error('Failed to load quiz history:', e)
      }
    }
  }, [])

  // Timer
  useEffect(() => {
    if (isLoading || showResult || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, isLoading, showResult, timeLeft])

  // Generate quiz on mount
  useEffect(() => {
    const generateQuiz = async () => {
      const text = sessionStorage.getItem('mindmate-quiz-text')

      if (!text) {
        setError('No text found. Please go back and enter some text first.')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to generate quiz')
        }

        const data = await response.json()
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(null))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    generateQuiz()
  }, [])

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
    } else {
      // Quiz finished
      const finalScore = selectedAnswer === questions[currentQuestion].correctAnswer ? score + 1 : score
      const percentage = Math.round((finalScore / questions.length) * 100)

      // Save to history
      const historyEntry: QuizHistory = {
        date: new Date().toISOString(),
        score: finalScore,
        total: questions.length,
        percentage,
      }
      const newHistory = [historyEntry, ...quizHistory].slice(0, 10) // Keep only last 10
      setQuizHistory(newHistory)
      localStorage.setItem('mindmate-quiz-history', JSON.stringify(newHistory))

      setShowResult(true)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setTimeLeft(30)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers(new Array(questions.length).fill(null))
    setTimeLeft(30)
  }

  const getOptionClass = (index: number) => {
    if (showResult) {
      if (index === questions[currentQuestion].correctAnswer) {
        return 'bg-green-100 border-green-500 text-green-800'
      }
      if (index === answers[currentQuestion] && index !== questions[currentQuestion].correctAnswer) {
        return 'bg-red-100 border-red-500 text-red-800'
      }
    } else if (selectedAnswer === index) {
      return 'bg-blue-100 border-blue-500 text-blue-800'
    }
    return 'bg-white border-gray-300 text-gray-800 hover:border-blue-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating your quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-3xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              {passed ? (
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-24 h-24 text-orange-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-600 mb-4">
                You scored {score} out of {questions.length} questions
              </p>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
                <p className="text-5xl font-bold mb-2">{percentage}%</p>
                <p className="text-xl">Final Score</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-700">{score}</p>
                  <p className="text-sm text-green-600">Correct</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-700">{questions.length - score}</p>
                  <p className="text-sm text-red-600">Incorrect</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-700">{questions.length}</p>
                  <p className="text-sm text-blue-600">Total</p>
                </div>
              </div>
            </div>

            {/* Review Answers */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Review Your Answers</h2>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-800 mb-2">
                      {index + 1}. {q.question}
                    </p>
                    <div className="ml-4 space-y-2 mb-2">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${
                            optIndex === q.correctAnswer
                              ? 'bg-green-100 text-green-800'
                              : optIndex === answers[index]
                              ? 'bg-red-100 text-red-800'
                              : 'text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === q.correctAnswer && (
                            <span className="ml-2 text-green-600">✓ Correct</span>
                          )}
                          {optIndex === answers[index] && optIndex !== q.correctAnswer && (
                            <span className="ml-2 text-red-600">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 italic">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz History */}
            {quizHistory.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-blue-600 hover:underline mb-3"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showHistory ? 'Hide' : 'Show'} Quiz History
                </button>

                {showHistory && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Recent Quiz Attempts</h3>
                    <div className="space-y-2">
                      {quizHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                          <span className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()} at{' '}
                            {new Date(entry.date).toLocaleTimeString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                              {entry.score}/{entry.total}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                entry.percentage >= 70
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {entry.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Retry Quiz
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className={`font-mono text-lg ${timeLeft <= 5 ? 'text-red-600 font-bold' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${getOptionClass(
                  index
                )}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  )
}
