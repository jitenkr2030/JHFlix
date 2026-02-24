'use client'

import { useState, useEffect } from 'react'
import { Play, Plus, X, Clock, Star, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface WatchlistItem {
  id: string
  addedAt: string
  video: {
    id: string
    title: string
    thumbnail: string
    duration: number
    year: number
    language: string
    category: string
    viewCount: number
    creator: {
      id: string
      name: string
      avatar?: string
    }
  }
}

interface WatchlistManagerProps {
  userId: string
}

export function WatchlistManager({ userId }: WatchlistManagerProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [userId])

  const fetchWatchlist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/watchlist?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setWatchlist(data.watchlist)
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWatchlist = async (videoId: string) => {
    if (!confirm('Remove this video from your watchlist?')) {
      return
    }

    try {
      const response = await fetch(`/api/watchlist?userId=${userId}&videoId=${videoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWatchlist(watchlist.filter(item => item.video.id !== videoId))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to remove from watchlist')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MOVIE: 'bg-red-100 text-red-800',
      WEB_SERIES: 'bg-blue-100 text-blue-800',
      MUSIC: 'bg-green-100 text-green-800',
      CULTURE: 'bg-purple-100 text-purple-800',
      DOCUMENTARY: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-12 h-12 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
        <p className="text-gray-400 mb-6">Add videos to your watchlist to watch them later</p>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => window.location.href = '/'}
        >
          Browse Videos
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Watchlist</h2>
        <Badge variant="secondary" className="text-sm">
          {watchlist.length} {watchlist.length === 1 ? 'video' : 'videos'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {watchlist.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800 overflow-hidden group">
            <div className="flex">
              {/* Thumbnail */}
              <div className="relative w-48 h-28 flex-shrink-0">
                <img
                  src={item.video.thumbnail}
                  alt={item.video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    className="bg-red-600 hover:bg-red-700 rounded-full"
                    onClick={() => window.location.href = `/video/${item.video.id}`}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/60 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(item.video.duration)}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-4 flex-1">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {item.video.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>{item.video.year}</span>
                      <span>{item.video.language}</span>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.video.viewCount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(item.video.category)}`}>
                        {item.video.category.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={item.video.creator.avatar} />
                        <AvatarFallback className="text-xs">
                          {item.video.creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">{item.video.creator.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={() => window.location.href = `/video/${item.video.id}`}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeFromWatchlist(item.video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Added Date */}
                <div className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}