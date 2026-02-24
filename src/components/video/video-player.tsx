'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Download, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface VideoPlayerProps {
  video: {
    id: string
    title: string
    videoUrl: string
    thumbnail: string
    duration: number
    language: string
    ageRating: string
    isPremium: boolean
  }
  onClose?: () => void
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [subtitleEnabled, setSubtitleEnabled] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.volume = value[0]
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSettings(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const shareVideo = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Video link copied to clipboard!')
    setShowShareDialog(false)
  }

  const downloadVideo = () => {
    // In production, this would trigger actual download
    alert('Download feature available for premium users')
  }

  const qualities = ['auto', '1080p', '720p', '480p', '360p']
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <div className="relative bg-black">
      {/* Video Container */}
      <div ref={containerRef} className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          poster={video.thumbnail}
          onClick={togglePlay}
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                  <X className="w-6 h-6" />
                </Button>
              )}
              <div>
                <h3 className="text-white font-semibold">{video.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {video.language}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gray-400 text-gray-300">
                    {video.ageRating}
                  </Badge>
                  {video.isPremium && (
                    <Badge className="text-xs bg-yellow-600">
                      PREMIUM
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowShareDialog(true)}
                className="text-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={downloadVideo}
                className="text-white"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="icon" 
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Settings Button */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  
                  {/* Settings Menu */}
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-4 min-w-[200px] border border-gray-700">
                      <div className="space-y-4">
                        {/* Quality */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Quality</h4>
                          <div className="space-y-1">
                            {qualities.map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setQuality(q)
                                  setShowSettings(false)
                                }}
                                className={`block w-full text-left px-2 py-1 rounded text-sm ${
                                  quality === q ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                {q.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Playback Speed */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Speed</h4>
                          <div className="space-y-1">
                            {speeds.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => changePlaybackSpeed(speed)}
                                className={`block w-full text-left px-2 py-1 rounded text-sm ${
                                  playbackSpeed === speed ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Subtitles */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Subtitles</h4>
                          <button
                            onClick={() => {
                              setSubtitleEnabled(!subtitleEnabled)
                              setShowSettings(false)
                            }}
                            className={`block w-full text-left px-2 py-1 rounded text-sm ${
                              subtitleEnabled ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            {subtitleEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Share Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">Share this amazing Jharkhand content with others!</p>
            <Button onClick={shareVideo} className="w-full bg-red-600 hover:bg-red-700">
              Copy Link to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}