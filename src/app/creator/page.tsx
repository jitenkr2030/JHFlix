'use client'

import { useState, useEffect } from 'react'
import { Upload, Play, Eye, DollarSign, Users, TrendingUp, Plus, Edit, Trash2, BarChart3, Film, Music, Tv, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import { UploadModal } from '@/components/upload/upload-modal'

// Mock creator data
const mockCreator = {
  id: 'creator1',
  name: 'Jharkhand Films',
  email: 'contact@jharkhandfilms.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  verified: true,
  subscribers: 15420,
  totalViews: 1250000,
  totalEarnings: 45600,
  joinDate: '2023-01-15'
}

const mockStats = {
  totalVideos: 24,
  totalWatchTime: 89000, // in minutes
  avgWatchTime: 65, // percentage
  engagementRate: 12.5,
  monthlyGrowth: 23
}

const mockVideos = [
  {
    id: '1',
    title: 'Nagpuri Love Story',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=280&fit=crop',
    duration: 8160,
    views: 15420,
    likes: 892,
    earnings: 234.50,
    status: 'published',
    uploadedAt: '2024-01-15',
    category: 'MOVIE'
  },
  {
    id: '2',
    title: 'Santali Folk Dance',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=280&fit=crop',
    duration: 2720,
    views: 8934,
    likes: 567,
    earnings: 145.30,
    status: 'published',
    uploadedAt: '2024-01-10',
    category: 'CULTURE'
  },
  {
    id: '3',
    title: 'Jharkhand Documentary',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=280&fit=crop',
    duration: 6300,
    views: 5678,
    likes: 234,
    earnings: 89.20,
    status: 'processing',
    uploadedAt: '2024-01-20',
    category: 'DOCUMENTARY'
  }
]

const mockEarnings = [
  { month: 'Jan', amount: 3400 },
  { month: 'Feb', amount: 3800 },
  { month: 'Mar', amount: 4200 },
  { month: 'Apr', amount: 3900 },
  { month: 'May', amount: 4500 },
  { month: 'Jun', amount: 5100 }
]

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [videos, setVideos] = useState(mockVideos)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleUploadComplete = (newVideo: any) => {
    // Add new video to the list
    setVideos([{
      ...newVideo,
      thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=280&fit=crop',
      duration: 3600,
      views: 0,
      likes: 0,
      earnings: 0,
      status: 'processing',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'MOVIE'
    }, ...videos])
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MOVIE': return Film
      case 'MUSIC': return Music
      case 'WEB_SERIES': return Tv
      default: return Calendar
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600'
      case 'processing': return 'bg-yellow-600'
      case 'draft': return 'bg-gray-600'
      case 'rejected': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JHFlix</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="hover:text-red-500 transition-colors"
                >
                  Home
                </button>
                <button className="text-red-500 font-semibold">Creator Studio</button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={mockCreator.avatar} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-red-600 to-orange-600">
                    {mockCreator.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{mockCreator.name}</span>
                    {mockCreator.verified && (
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Creator Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mockCreator.avatar} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-red-600 to-orange-600">
                  {mockCreator.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{mockCreator.name}</h1>
                  {mockCreator.verified && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400">Creator since {new Date(mockCreator.joinDate).getFullYear()}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Subscribers</p>
                      <p className="text-2xl font-bold">{formatNumber(mockCreator.subscribers)}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold">{formatNumber(mockCreator.totalViews)}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Earnings</p>
                      <p className="text-2xl font-bold">₹{formatNumber(mockCreator.totalEarnings)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Growth</p>
                      <p className="text-2xl font-bold">+{mockStats.monthlyGrowth}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-red-600">
                <Film className="w-4 h-4 mr-2" />
                My Content
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-red-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Earnings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Channel Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Total Videos</span>
                        <span className="font-medium">{mockStats.totalVideos}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Avg. Watch Time</span>
                        <span className="font-medium">{mockStats.avgWatchTime}%</span>
                      </div>
                      <Progress value={mockStats.avgWatchTime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Engagement Rate</span>
                        <span className="font-medium">{mockStats.engagementRate}%</span>
                      </div>
                      <Progress value={mockStats.engagementRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Uploads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {videos.slice(0, 3).map((video) => (
                        <div key={video.id} className="flex items-center space-x-3">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                            <p className="text-xs text-gray-400">
                              {formatNumber(video.views)} views • {formatDuration(video.duration)}
                            </p>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(video.status)}`}>
                            {video.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Content</CardTitle>
                  <Button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {videos.map((video) => {
                      const Icon = getCategoryIcon(video.category)
                      return (
                        <div key={video.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-20 h-12 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold">{video.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                <span className="flex items-center">
                                  <Icon className="w-3 h-3 mr-1" />
                                  {video.category.replace('_', ' ')}
                                </span>
                                <span>{formatDuration(video.duration)}</span>
                                <span>{formatNumber(video.views)} views</span>
                                <span>₹{video.earnings.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getStatusColor(video.status)}`}>
                              {video.status}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard userId={mockCreator.id} userRole="CREATOR" />
            </TabsContent>

            <TabsContent value="earnings">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-2">₹{mockCreator.totalEarnings.toLocaleString()}</div>
                    <p className="text-gray-400">Total earnings</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Monthly Earnings</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {mockEarnings.map((earning) => (
                        <div key={earning.month} className="text-center">
                          <div className="text-lg font-semibold">₹{earning.amount}</div>
                          <div className="text-xs text-gray-400">{earning.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <p className="text-sm text-gray-400 mb-1">Next payout date: 1st February 2024</p>
                    <p className="text-sm text-gray-400">Payment method: Bank Transfer</p>
                    <Button className="mt-3 bg-red-600 hover:bg-red-700">
                      Update Payment Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}