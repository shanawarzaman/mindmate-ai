import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, questionTypes } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const types = questionTypes || ['multiple-choice', 'true-false', 'fill-blank']

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful study assistant that creates diverse quiz questions.
Generate questions from the provided text with these types: ${types.join(', ')}.

Create a mix of:
- Multiple choice (4 options, 1 correct)
- True/False questions
- Fill in the blank questions

Return your response in the following JSON format:
{
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Explanation here"
    },
    {
      "type": "true-false",
      "question": "Statement here",
      "correctAnswer": true,
      "explanation": "Explanation here"
    },
    {
      "type": "fill-blank",
      "question": "The ___ is important because...",
      "correctAnswer": "answer",
      "explanation": "Explanation here"
    }
  ]
}

Generate at least 15 questions with a good mix of all types.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const aiResponse = JSON.parse(responseContent)

    return NextResponse.json({
      questions: aiResponse.questions || [],
    })
  } catch (error) {
    console.error('Error generating advanced quiz:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    )
  }
}
