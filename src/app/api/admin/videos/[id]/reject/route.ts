import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    // Delete the rejected video
    await db.video.delete({
      where: { id: videoId }
    })

    // Create notification for creator (in production)
    console.log(`Video ${videoId} rejected and deleted`)

    return NextResponse.json({
      message: 'Video rejected successfully'
    })
  } catch (error) {
    console.error('Reject video error:', error)
    return NextResponse.json(
      { error: 'Failed to reject video' },
      { status: 500 }
    )
  }
}