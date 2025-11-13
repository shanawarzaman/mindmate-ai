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
          content: `You are a helpful study assistant that creates flashcards for learning.
Generate 8-12 high-quality flashcards from the provided text. Each flashcard should have:
- A clear question on the front
- A concise answer on the back
- A difficulty level (easy, medium, or hard)

Return your response in the following JSON format:
{
  "flashcards": [
    {
      "question": "What is...",
      "answer": "The answer is...",
      "difficulty": "easy"
    }
  ]
}`,
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
      flashcards: aiResponse.flashcards || [],
    })
  } catch (error) {
    console.error('Error generating flashcards:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate flashcards. Please try again.' },
      { status: 500 }
    )
  }
}
