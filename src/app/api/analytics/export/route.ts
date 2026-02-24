import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const userRole = searchParams.get('userRole') || 'USER'
    const format = searchParams.get('format') || 'csv'
    const userId = searchParams.get('userId')

    // Generate CSV content based on user role and time range
    let csvContent = ''
    let filename = ''

    if (userRole === 'ADMIN') {
      filename = `admin-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
      csvContent = `Date,New Users,Active Users,Revenue,Subscribers,Videos
2024-01-20,120,8500,45000,150,45
2024-01-19,135,8600,48000,155,47
2024-01-18,125,8450,52000,160,48
2024-01-17,145,8700,49000,165,50
2024-01-16,160,8900,55000,170,52
2024-01-15,155,8800,58000,175,54
2024-01-14,170,9100,62000,180,56`
    } else if (userRole === 'CREATOR') {
      filename = `creator-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
      csvContent = `Date,Views,Watch Time,Revenue,Subscribers,Engagement
2024-01-20,1200,7200,450,100,12.5
2024-01-19,1350,8100,480,120,13.2
2024-01-18,1400,8400,520,115,11.8
2024-01-17,1550,9300,490,130,14.1
2024-01-16,1600,9600,550,145,12.9
2024-01-15,1750,10500,580,140,13.5
2024-01-14,1800,10800,620,155,14.8`
    } else {
      filename = `user-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
      csvContent = `Date,Videos Watched,Watch Time,Session Length,Content Liked
2024-01-20,2,120,60,1
2024-01-19,1,45,45,0
2024-01-18,3,180,60,2
2024-01-17,4,240,60,1
2024-01-16,2,150,75,1
2024-01-15,2,120,60,0
2024-01-14,3,180,60,2`
    }

    // Set appropriate headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return new NextResponse(csvContent, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Export analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    )
  }
}