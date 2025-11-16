import { NextRequest, NextResponse } from 'next/server'
const pdf = require('pdf-parse')
import mammoth from 'mammoth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileType = file.name.split('.').pop()?.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())

    let extractedText = ''

    switch (fileType) {
      case 'pdf':
        try {
          const pdfData = await pdf(buffer)
          extractedText = pdfData.text
        } catch (error) {
          console.error('PDF parsing error:', error)
          return NextResponse.json(
            { error: 'Failed to parse PDF file. Please ensure it contains readable text.' },
            { status: 400 }
          )
        }
        break

      case 'docx':
        try {
          const result = await mammoth.extractRawText({ buffer })
          extractedText = result.value
        } catch (error) {
          console.error('DOCX parsing error:', error)
          return NextResponse.json(
            { error: 'Failed to parse DOCX file.' },
            { status: 400 }
          )
        }
        break

      case 'txt':
        try {
          extractedText = buffer.toString('utf-8')
        } catch (error) {
          console.error('TXT parsing error:', error)
          return NextResponse.json(
            { error: 'Failed to read TXT file.' },
            { status: 400 }
          )
        }
        break

      default:
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
          { status: 400 }
        )
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text: extractedText.trim(),
      fileName: file.name,
      fileType: fileType,
    })
  } catch (error) {
    console.error('Error extracting text:', error)
    return NextResponse.json(
      { error: 'Failed to process file. Please try again.' },
      { status: 500 }
    )
  }
}
