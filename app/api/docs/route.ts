import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Documentation index cache
let docsCache: any = null

interface DocMetadata {
  title: string
  description: string
  category: string
  version: string
  updated?: string
  author?: string
  tags?: string[]
}

interface DocPage {
  id: string
  title: string
  description: string
  category: string
  slug: string
  metadata: DocMetadata
}

// Parse markdown front matter
function parseFrontMatter(content: string) {
  const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(regex)
  
  if (!match) {
    return { metadata: {}, content }
  }
  
  const yamlContent = match[1]
  const body = match[2]
  
  const metadata: DocMetadata = {
    title: '',
    description: '',
    category: '',
    version: '1.0.0'
  }
  
  // Parse YAML front matter
  yamlContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '')
    
    if (key && value) {
      const normalizedKey = key.trim().toLowerCase()
      if (normalizedKey === 'title') metadata.title = value
      if (normalizedKey === 'description') metadata.description = value
      if (normalizedKey === 'category') metadata.category = value
      if (normalizedKey === 'version') metadata.version = value
      if (normalizedKey === 'updated') metadata.updated = value
      if (normalizedKey === 'author') metadata.author = value
      if (normalizedKey === 'tags') {
        metadata.tags = value
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map(t => t.trim())
      }
    }
  })
  
  return { metadata, content: body }
}

// Get documentation index
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'search') {
      return handleSearch(searchParams)
    }

    if (action === 'versions') {
      return handleVersions()
    }

    if (action === 'changelog') {
      return handleChangelog(searchParams)
    }

    // Default: return documentation index
    return handleIndex()
  } catch (error) {
    console.error('Error in docs API:', error)
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

async function handleIndex() {
  try {
    const docsDir = path.join(process.cwd(), 'docs', 'content')
    const files = await fs.readdir(docsDir)
    
    const categories = new Map<string, DocPage[]>()
    let totalPages = 0

    for (const file of files) {
      if (!file.endsWith('.md')) continue
      
      const filePath = path.join(docsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const { metadata } = parseFrontMatter(content)
      
      if (metadata.title && metadata.category) {
        const page: DocPage = {
          id: file.replace('.md', ''),
          title: metadata.title,
          description: metadata.description || '',
          category: metadata.category,
          slug: file.replace('.md', ''),
          metadata
        }
        
        if (!categories.has(metadata.category)) {
          categories.set(metadata.category, [])
        }
        categories.get(metadata.category)!.push(page)
        totalPages++
      }
    }

    const categoryList = Array.from(categories.entries()).map(([name, pages]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      title: name,
      description: pages[0]?.description || '',
      pages: pages.map(p => p.slug),
      count: pages.length
    }))

    return NextResponse.json({
      categories: categoryList,
      totalPages,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    })
  } catch (error) {
    console.error('Error reading docs:', error)
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Documentation not found' } },
      { status: 404 }
    )
  }
}

async function handleSearch(params: URLSearchParams) {
  const query = params.get('q') || ''
  const category = params.get('category')
  const limit = parseInt(params.get('limit') || '10', 10)

  if (!query || query.length < 2) {
    return NextResponse.json({
      error: { code: 'BAD_REQUEST', message: 'Query too short (minimum 2 characters)' }
    }, { status: 400 })
  }

  try {
    const docsDir = path.join(process.cwd(), 'docs', 'content')
    const files = await fs.readdir(docsDir)
    
    const results = []
    const queryLower = query.toLowerCase()

    for (const file of files) {
      if (!file.endsWith('.md')) continue
      
      const filePath = path.join(docsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const { metadata, content: body } = parseFrontMatter(content)

      if (category && metadata.category !== category) continue

      const titleMatch = metadata.title?.toLowerCase().includes(queryLower)
      const descMatch = metadata.description?.toLowerCase().includes(queryLower)
      const contentMatch = body.toLowerCase().includes(queryLower)

      if (titleMatch || descMatch || contentMatch) {
        let score = 0
        if (titleMatch) score += 3
        if (descMatch) score += 2
        if (contentMatch) score += 1

        // Extract snippet
        const contentLines = body.split('\n')
        const matchLine = contentLines.find(line => 
          line.toLowerCase().includes(queryLower)
        )
        const snippet = matchLine?.substring(0, 100) || metadata.description || ''

        results.push({
          id: file.replace('.md', ''),
          title: metadata.title,
          category: metadata.category,
          snippet,
          score: score / 3,
          path: `/docs/${metadata.category}/${file.replace('.md', '')}`
        })
      }
    }

    return NextResponse.json({
      results: results.sort((a, b) => b.score - a.score).slice(0, limit),
      total: results.length,
      query
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Search failed' } },
      { status: 500 }
    )
  }
}

async function handleVersions() {
  return NextResponse.json({
    versions: [
      {
        version: '1.0.0',
        releaseDate: new Date().toISOString(),
        status: 'latest',
        url: 'https://docs.example.com/v1.0.0'
      },
      {
        version: '0.9.0',
        releaseDate: new Date(Date.now() - 86400000).toISOString(),
        status: 'archived',
        url: 'https://docs.example.com/v0.9.0'
      }
    ]
  })
}

async function handleChangelog(params: URLSearchParams) {
  const limit = parseInt(params.get('limit') || '20', 10)
  
  return NextResponse.json({
    entries: [
      {
        date: new Date().toISOString(),
        version: '1.0.0',
        changes: [
          { type: 'added', description: 'Initial documentation release' },
          { type: 'added', description: 'API endpoints documentation' },
          { type: 'added', description: 'Deployment guides' }
        ]
      }
    ]
  })
}
