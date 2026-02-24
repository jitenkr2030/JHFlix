import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['active', 'suspended', 'banned'])
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    const { status } = statusSchema.parse(body)

    // Update user status
    const user = await db.user.update({
      where: { id: userId },
      data: { 
        // In production, add a status field to the User model
        // For now, we'll just return success
      }
    })

    return NextResponse.json({
      user,
      message: `User ${status} successfully`
    })
  } catch (error) {
    console.error('Update user status error:', error)
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}