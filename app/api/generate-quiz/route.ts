import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful study assistant that creates multiple-choice quiz questions.
Generate exactly 10 multiple-choice questions from the provided text. Each question should:
- Test understanding of key concepts
- Have 4 answer options (A, B, C, D)
- Have exactly one correct answer
- Include an explanation for the correct answer

Return your response in the following JSON format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "The correct answer is A because..."
    }
  ]
}

The correctAnswer should be the index (0-3) of the correct option in the options array.`,
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
    console.error('Error generating quiz:', error)

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
