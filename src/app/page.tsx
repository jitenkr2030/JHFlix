'use client'

import { useState, useEffect } from 'react'
import { Search, Play, Plus, Star, TrendingUp, Clock, ChevronRight, Menu, X, User, LogIn, Film, Music, Tv, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LoginModal } from '@/components/auth/login-modal'

// Mock data for demonstration
const trendingVideos = [
  {
    id: '1',
    title: 'Nagpuri Love Story',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=280&fit=crop',
    duration: '2:15:30',
    year: 2024,
    language: 'Nagpuri',
    rating: 4.5,
    category: 'MOVIE'
  },
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

const categories = [
  { name: 'Movies', icon: Film, color: 'bg-red-500' },
  { name: 'Web Series', icon: Tv, color: 'bg-blue-500' },
  { name: 'Music', icon: Music, color: 'bg-green-500' },
  { name: 'Culture', icon: Calendar, color: 'bg-purple-500' }
]

const languages = ['Nagpuri', 'Santali', 'Khortha', 'Hindi', 'English']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatDuration = (duration: string) => {
    return duration
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">JHFlix</span>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <button className="hover:text-red-500 transition-colors">Home</button>
                <button className="hover:text-red-500 transition-colors">Movies</button>
                <button className="hover:text-red-500 transition-colors">Web Series</button>
                <button className="hover:text-red-500 transition-colors">Music</button>
                <button className="hover:text-red-500 transition-colors">Culture</button>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-900 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <Input
                  placeholder="Search movies, shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                />
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-red-500"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black text-white border-gray-800">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <button className="hover:text-red-500 transition-colors text-left">Home</button>
                    <button className="hover:text-red-500 transition-colors text-left">Movies</button>
                    <button className="hover:text-red-500 transition-colors text-left">Web Series</button>
                    <button className="hover:text-red-500 transition-colors text-left">Music</button>
                    <button className="hover:text-red-500 transition-colors text-left">Culture</button>
                    <div className="pt-4 border-t border-gray-800">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:text-red-500"
                        onClick={() => setIsLoginModalOpen(true)}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button 
                        className="w-full mt-2 bg-red-600 hover:bg-red-700"
                        onClick={() => setIsLoginModalOpen(true)}
                      >
                        Get Started
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
            alt="Jharkhand Cinema"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-red-600 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending in Jharkhand
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Jharkhand ka Apna<br />
              <span className="text-red-500">Digital Entertainment</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover the rich culture, cinema, and music of Jharkhand. 
              Stream exclusive regional content in Nagpuri, Santali, Khortha and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Watching
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending in Jharkhand</h2>
            <Button variant="ghost" className="text-red-500 hover:text-red-400">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <Card 
                key={video.id} 
                className="bg-gray-900 border-gray-800 overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
                onClick={() => window.location.href = `/video/${video.id}`}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" className="bg-red-600 hover:bg-red-700 rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/60">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(video.duration)}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{video.year}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {video.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.language}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(video.category)}`}>
                      {video.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Explore by Language</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((language) => (
              <Button
                key={language}
                variant="outline"
                className="border-gray-700 text-white hover:bg-red-600 hover:border-red-600"
              >
                {language}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why JHFlix?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Regional Content</h3>
              <p className="text-gray-400">Exclusive movies, shows, and music from Jharkhand in local languages</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Creators</h3>
              <p className="text-gray-400">Empowering local artists and filmmakers to showcase their talent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ad-Free Streaming</h3>
              <p className="text-gray-400">Enjoy uninterrupted entertainment with premium subscription</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your JHFlix Journey</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of viewers exploring Jharkhand's rich cultural heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JHFlix</span>
              </div>
              <p className="text-gray-400">Jharkhand ka Apna Digital Entertainment</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Content</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Movies</button></li>
                <li><button className="hover:text-white">Web Series</button></li>
                <li><button className="hover:text-white">Music</button></li>
                <li><button className="hover:text-white">Culture</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Contact Us</button></li>
                <li><button className="hover:text-white">Device Support</button></li>
                <li><button className="hover:text-white">Accessibility</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">About Us</button></li>
                <li><button className="hover:text-white">Careers</button></li>
                <li><button className="hover:text-white">Press</button></li>
                <li><button className="hover:text-white">Partners</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JHFlix. All rights reserved. Celebrating Jharkhand's Culture.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}

// Add the missing Users icon
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)