import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const language = searchParams.get('language')
    const search = searchParams.get('search')
    const trending = searchParams.get('trending')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isPublic: true,
      approvedAt: { not: null }
    }

    if (category && category !== 'All') {
      where.category = category.toUpperCase()
    }

    if (language && language !== 'All') {
      where.language = language.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    // Order by view count for trending
    const orderBy = trending === 'true' 
      ? { viewCount: 'desc' as const }
      : { createdAt: 'desc' as const }

    const videos = await db.video.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy,
      take: limit,
      skip: offset
    })

    // Format response
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: formatDuration(video.duration),
      year: video.releaseYear,
      language: video.language,
      rating: calculateRating(video._count.reviews),
      category: video.category,
      viewCount: video.viewCount,
      creator: video.creator,
      isPremium: video.isPremium,
      ageRating: video.ageRating
    }))

    return NextResponse.json({
      videos: formattedVideos,
      total: videos.length,
      hasMore: videos.length === limit
    })
  } catch (error) {
    console.error('Videos API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// Helper functions
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function calculateRating(reviewCount: number): number {
  // For demo, return random rating between 3.5 and 5
  // In production, calculate from actual review ratings
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
}