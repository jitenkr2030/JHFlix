'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SubscriptionPlans } from './subscription-plans'

interface SubscriptionManagerProps {
  userId: string
}

export function SubscriptionManager({ userId }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [userId])

  const fetchSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/subscription?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setSubscription(data.activeSubscription)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanSelect = async (plan: any) => {
    if (plan.id === 'FREE') {
      // Handle downgrading to free
      try {
        const response = await fetch('/api/subscription/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
        
        if (response.ok) {
          setSubscription(null)
          alert('Subscription cancelled. You will continue to have access until the end of your billing period.')
        }
      } catch (error) {
        alert('Failed to cancel subscription. Please try again.')
      }
    } else {
      // Handle upgrading/changing plan
      try {
        const response = await fetch('/api/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            plan: plan.id,
            paymentId: `PAY_${Date.now()}` // Mock payment ID
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
          alert(`${plan.name} subscription activated successfully!`)
        }
      } catch (error) {
        alert('Failed to update subscription. Please try again.')
      }
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return
    }

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        alert('Subscription cancelled successfully!')
        fetchSubscription()
      } else {
        alert('Failed to cancel subscription. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'MONTHLY': return 'bg-blue-600'
      case 'YEARLY': return 'bg-purple-600'
      case 'LIFETIME': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
          <p className="text-gray-400 mb-6">Upgrade to Premium to unlock all features</p>
          
          <Dialog open={isPlansModalOpen} onOpenChange={setIsPlansModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                Upgrade to Premium
              </Button>
            </DialogTrigger>
            <SubscriptionPlans
              isOpen={isPlansModalOpen}
              onClose={() => setIsPlansModalOpen(false)}
              onPlanSelect={handlePlanSelect}
            />
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Subscription</CardTitle>
            <Badge className={`${getPlanColor(subscription.plan)} text-white`}>
              {subscription.plan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="font-medium">{subscription.plan.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Price</span>
                <span className="font-medium">₹{subscription.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Started</span>
                <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Expires</span>
                <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Days Remaining</span>
                <span className="font-medium">{getDaysRemaining(subscription.endDate)} days</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Dialog open={isPlansModalOpen} onOpenChange={setIsPlansModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
              </DialogTrigger>
              <SubscriptionPlans
                isOpen={isPlansModalOpen}
                onClose={() => setIsPlansModalOpen(false)}
                onPlanSelect={handlePlanSelect}
                currentPlan={subscription.plan}
              />
            </Dialog>
            
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">•••• 4242</p>
                <p className="text-sm text-gray-400">Visa</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <div>
                <p className="font-medium">Premium {subscription.plan.replace('_', ' ')}</p>
                <p className="text-sm text-gray-400">{new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{subscription.price}</p>
                <Badge variant="default" className="text-xs bg-green-600">
                  Paid
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}