import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { category: string; slug: string } }
) {
  const { category, slug } = params

  try {
    // In production, read from docs/content/{category}/{slug}.md
    // For now, return mock data
    
    return NextResponse.json({
      id: `${category}-${slug}`,
      title: `${category} - ${slug}`,
      description: 'Documentation page',
      category,
      content: '<h1>Content Loading</h1><p>Documentation content would be rendered here.</p>',
      metadata: {
        version: '1.0.0',
        updated: new Date().toISOString(),
        author: 'EMS Team'
      },
      related: [],
      navigation: {
        previous: null,
        next: null
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Page not found' } },
      { status: 404 }
    )
  }
}
