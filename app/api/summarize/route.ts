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

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful study assistant. Your task is to:
1. Create a concise summary of the provided text
2. Extract key points as a bulleted list (3-7 points)

Return your response in the following JSON format:
{
  "summary": "A concise summary of the text",
  "keyPoints": ["Point 1", "Point 2", "Point 3"]
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

    // Calculate statistics
    const originalLength = text.length
    const summaryLength = aiResponse.summary.length
    const compressionRate = Math.round(
      ((originalLength - summaryLength) / originalLength) * 100
    )
    const estimatedReadTime = Math.ceil(
      aiResponse.summary.split(/\s+/).length / 200
    ) // Assuming 200 words per minute

    return NextResponse.json({
      summary: aiResponse.summary,
      keyPoints: aiResponse.keyPoints,
      originalLength,
      summaryLength,
      compressionRate,
      estimatedReadTime,
    })
  } catch (error) {
    console.error('Error in summarize API:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to summarize text. Please try again.' },
      { status: 500 }
    )
  }
}
