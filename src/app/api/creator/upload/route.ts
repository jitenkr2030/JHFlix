import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const videoFile = formData.get('video') as File
    const thumbnailFile = formData.get('thumbnail') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const language = formData.get('language') as string
    const releaseYear = parseInt(formData.get('releaseYear') as string)
    const ageRating = formData.get('ageRating') as string
    const isPremium = formData.get('isPremium') === 'true'
    const tags = formData.get('tags') as string

    // Validate required fields
    if (!videoFile || !thumbnailFile || !title || !description || !category || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock creator ID - in production, get from auth context
    const creatorId = 'creator1'

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filenames
    const timestamp = Date.now()
    const videoFileName = `video_${timestamp}_${videoFile.name}`
    const thumbnailFileName = `thumbnail_${timestamp}_${thumbnailFile.name}`

    // Save files
    const videoPath = join(uploadsDir, videoFileName)
    const thumbnailPath = join(uploadsDir, thumbnailFileName)

    try {
      const videoBytes = await videoFile.arrayBuffer()
      await writeFile(videoPath, new Uint8Array(videoBytes))

      const thumbnailBytes = await thumbnailFile.arrayBuffer()
      await writeFile(thumbnailPath, new Uint8Array(thumbnailBytes))
    } catch (error) {
      console.error('File save error:', error)
      return NextResponse.json(
        { error: 'Failed to save files' },
        { status: 500 }
      )
    }

    // Calculate video duration (mock - in production, use ffmpeg)
    const duration = Math.floor(Math.random() * 7200) + 600 // 10-120 minutes

    // Create video record in database
    const video = await db.video.create({
      data: {
        title,
        description,
        thumbnail: `/uploads/${thumbnailFileName}`,
        videoUrl: `/uploads/${videoFileName}`,
        duration,
        category: category as any,
        language: language as any,
        releaseYear,
        ageRating: ageRating as any,
        isPremium,
        tags,
        createdBy: creatorId,
        isPublic: false, // Requires admin approval
        approvedAt: null // Pending approval
      }
    })

    // Create notification for admin (in production)
    console.log(`New video uploaded for approval: ${video.id}`)

    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        status: 'processing'
      },
      message: 'Video uploaded successfully! It will be available after admin approval.'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}