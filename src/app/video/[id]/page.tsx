'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Play, Plus, Star, Clock, Calendar, User, Share2, Download, Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { VideoPlayer } from '@/components/video/video-player'
import { LoginModal } from '@/components/auth/login-modal'

// Mock video data - in production, fetch from API
const mockVideoData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Nagpuri Love Story - A Cultural Romance',
    description: 'A beautiful love story set in the heart of Jharkhand, showcasing the rich Nagpuri culture and traditions. This film takes you on a journey through the scenic landscapes of Jharkhand while telling a timeless tale of love and sacrifice.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop',
    duration: 8160, // 2:16:00 in seconds
    year: 2024,
    language: 'Nagpuri',
    rating: 4.5,
    category: 'MOVIE',
    viewCount: 15420,
    likeCount: 892,
    ageRating: 'U',
    isPremium: false,
    director: 'Ranjan Kumar',
    cast: ['Amit Singh', 'Priya Sharma', 'Ramesh Thakur'],
    genres: ['Romance', 'Drama', 'Cultural'],
    creator: {
      id: 'creator1',
      name: 'Jharkhand Films',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    releaseDate: '2024-01-15',
    subtitleUrl: '/subtitles/video1.srt'
  }
}

const relatedVideos = [
  {
    id: '2',
    title: 'Santali Folk Festival',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=280&fit=crop',
    duration: '45:20',
    year: 2024,
    language: 'Santali',
    rating: 4.8,
    category: 'CULTURE'
  },
  {
    id: '3',
    title: 'Jharkhand Ki Kahani',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=280&fit=crop',
    duration: '1:45:00',
    year: 2023,
    language: 'Hindi',
    rating: 4.2,
    category: 'DOCUMENTARY'
  },
  {
    id: '4',
    title: 'Khortha Comedy Special',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=280&fit=crop',
    duration: '30:15',
    year: 2024,
    language: 'Khortha',
    rating: 4.6,
    category: 'WEB_SERIES'
  }
]

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState<any>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // In production, fetch from API
    const fetchVideo = async () => {
      const videoData = mockVideoData[videoId]
      if (videoData) {
        setVideo(videoData)
      }
    }
    fetchVideo()
  }, [videoId])

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
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

  const handleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // In production, call API to add/remove from watchlist
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // In production, call API to like/unlike
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Video link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowPlayer(false)}
                className="text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">JHFlix</span>
              </div>
            </div>
            <Button 
              variant="ghost"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white hover:text-red-500"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {showPlayer ? (
          <VideoPlayer 
            video={video}
            onClose={() => setShowPlayer(false)}
          />
        ) : (
          /* Hero Section with Thumbnail */
          <div className="relative h-screen">
            <div className="absolute inset-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/90" />
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-red-600 text-white">
                    {video.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary">
                    {video.language}
                  </Badge>
                  <Badge variant="outline" className="border-gray-400 text-gray-300">
                    {video.ageRating}
                  </Badge>
                  {video.isPremium && (
                    <Badge className="bg-yellow-600 text-white">
                      PREMIUM
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {video.title}
                </h1>

                <p className="text-xl text-gray-300 mb-8 max-w-3xl">
                  {video.description}
                </p>

                <div className="flex items-center space-x-6 text-gray-300 mb-8">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span>{video.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{video.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-1" />
                    <span>{video.viewCount.toLocaleString()} views</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6"
                    onClick={() => setShowPlayer(true)}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Play Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6"
                    onClick={handleWatchlist}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About this {video.category.toLowerCase()}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Cast & Crew */}
              <div>
                <h3 className="text-xl font-bold mb-4">Cast & Crew</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Director</p>
                    <p className="font-semibold">{video.director}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cast</p>
                    <p className="font-semibold">{video.cast.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Genres</p>
                    <p className="font-semibold">{video.genres.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleLike}
                  className={`border-gray-700 ${isLiked ? 'bg-red-600 text-white' : 'text-white'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'} ({video.likeCount})
                </Button>
                <Button variant="outline" onClick={handleShare} className="border-gray-700 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="border-gray-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="border-gray-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comments
                </Button>
              </div>

              {/* Related Videos */}
              <div>
                <h3 className="text-xl font-bold mb-6">Related Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Card key={relatedVideo.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex">
                        <img
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          className="w-40 h-24 object-cover"
                        />
                        <CardContent className="p-4 flex-1">
                          <h4 className="font-semibold mb-2 line-clamp-2">{relatedVideo.title}</h4>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{relatedVideo.duration}</span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              {relatedVideo.rating}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Creator Info */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Creator</h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={video.creator.avatar} />
                      <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{video.creator.name}</p>
                      <p className="text-sm text-gray-400">Content Creator</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    Follow
                  </Button>
                </CardContent>
              </Card>

              {/* Video Info */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Video Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Date</span>
                      <span>{new Date(video.releaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language</span>
                      <span>{video.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age Rating</span>
                      <span>{video.ageRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}