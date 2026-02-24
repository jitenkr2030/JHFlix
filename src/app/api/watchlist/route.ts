import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const watchlist = await db.watchlistItem.findMany({
      where: { userId },
      include: {
        video: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    })

    return NextResponse.json({ watchlist })
  } catch (error) {
    console.error('Get watchlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, videoId } = body

    if (!userId || !videoId) {
      return NextResponse.json(
        { error: 'User ID and Video ID are required' },
        { status: 400 }
      )
    }

    // Check if video exists
    const video = await db.video.findUnique({
      where: { id: videoId }
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Check if already in watchlist
    const existingItem = await db.watchlistItem.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Video already in watchlist' },
        { status: 400 }
      )
    }

    const watchlistItem = await db.watchlistItem.create({
      data: {
        userId,
        videoId
      },
      include: {
        video: true
      }
    })

    return NextResponse.json({
      watchlistItem,
      message: 'Added to watchlist successfully'
    })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const videoId = searchParams.get('videoId')

    if (!userId || !videoId) {
      return NextResponse.json(
        { error: 'User ID and Video ID are required' },
        { status: 400 }
      )
    }

    const deletedItem = await db.watchlistItem.delete({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      }
    })

    return NextResponse.json({
      message: 'Removed from watchlist successfully'
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    )
  }
}