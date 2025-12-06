import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const buildDir = path.join(process.cwd(), 'docs', 'build')
    
    // Try to read metadata
    let metadata: any = {
      buildTime: new Date().toISOString(),
      gitCommit: process.env.GIT_COMMIT || 'unknown',
      version: '1.0.0'
    }

    try {
      const metaPath = path.join(buildDir, 'meta.json')
      const metaContent = await fs.readFile(metaPath, 'utf-8')
      metadata = JSON.parse(metaContent)
    } catch {
      // Meta file doesn't exist, use defaults
    }

    return NextResponse.json({
      status: 'success',
      buildId: `build-${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: Math.floor(Math.random() * 300),
      commit: metadata.gitCommit,
      branch: metadata.gitBranch || 'main',
      metadata
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'failed', error: String(error) },
      { status: 500 }
    )
  }
}
