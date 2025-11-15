import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: `You are an expert AI tutor helping students learn. Your role is to:
1. Answer questions clearly and accurately
2. Use the Socratic method to guide learning
3. Provide examples and analogies
4. Break down complex topics
5. Encourage critical thinking
6. Be patient and supportive

${context ? `Context from student's materials:\n${context}` : ''}

Keep responses concise but informative. Ask follow-up questions to check understanding.`,
      },
    ]

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory)
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({
      response: responseContent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in tutor chat:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to get tutor response. Please try again.' },
      { status: 500 }
    )
  }
}
