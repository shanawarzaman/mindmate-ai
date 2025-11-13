import { NextRequest, NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ArxivEntry {
  id: string[]
  title: string[]
  summary: string[]
  author: Array<{ name: string[] }>
  published: string[]
  link: Array<{ $: { href: string } }>
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Search ArXiv API
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=5`

    const response = await fetch(arxivUrl)
    const xmlData = await response.text()

    // Parse XML response
    const parsedData = await parseStringPromise(xmlData)
    const entries: ArxivEntry[] = parsedData.feed.entry || []

    if (entries.length === 0) {
      return NextResponse.json({
        papers: [],
        message: 'No papers found for your query.',
      })
    }

    // Process papers
    const papers = await Promise.all(
      entries.map(async (entry) => {
        const title = entry.title[0].replace(/\n/g, ' ').trim()
        const abstract = entry.summary[0].replace(/\n/g, ' ').trim()
        const authors = entry.author.map((a) => a.name[0])
        const published = new Date(entry.published[0]).getFullYear()
        const arxivId = entry.id[0].split('/abs/')[1]
        const url = entry.id[0]

        // Generate APA citation
        const authorsCitation =
          authors.length > 1
            ? `${authors[0]}, et al.`
            : authors[0] || 'Unknown'
        const citation = `${authorsCitation} (${published}). ${title}. arXiv preprint arXiv:${arxivId}.`

        // Generate AI summary
        let aiSummary = ''
        try {
          if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a helpful research assistant. Summarize this academic paper abstract in 2-3 sentences, highlighting the main contribution and findings.',
                },
                {
                  role: 'user',
                  content: abstract,
                },
              ],
              temperature: 0.5,
              max_tokens: 200,
            })

            aiSummary =
              completion.choices[0]?.message?.content || abstract.slice(0, 300)
          } else {
            aiSummary = abstract.slice(0, 300)
          }
        } catch (error) {
          console.error('Error generating AI summary:', error)
          aiSummary = abstract.slice(0, 300)
        }

        return {
          id: arxivId,
          title,
          authors,
          published,
          abstract,
          aiSummary,
          citation,
          url,
        }
      })
    )

    return NextResponse.json({ papers })
  } catch (error) {
    console.error('Error searching papers:', error)
    return NextResponse.json(
      { error: 'Failed to search papers. Please try again.' },
      { status: 500 }
    )
  }
}
