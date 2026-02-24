'use client'

import { useState } from 'react'
import { Check, X, Crown, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

interface SubscriptionPlansProps {
  isOpen: boolean
  onClose: () => void
  onPlanSelect?: (plan: any) => void
  currentPlan?: string
}

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    duration: 'Forever',
    description: 'Perfect for exploring Jharkhand content',
    features: [
      'Access to free content',
      'SD quality streaming',
      'Limited content library',
      'Ads supported',
      'Single profile'
    ],
    notIncluded: [
      'HD/4K quality',
      'Offline downloads',
      'Multiple profiles',
      'Early access to new content'
    ],
    popular: false,
    color: 'border-gray-600'
  },
  {
    id: 'MONTHLY',
    name: 'Premium Monthly',
    price: 299,
    duration: 'per month',
    description: 'Most popular choice for regular viewers',
    features: [
      'Everything in Free',
      'HD & 4K quality streaming',
      'Ad-free experience',
      'Offline downloads',
      'Up to 5 profiles',
      'Early access to new releases',
      'Priority customer support'
    ],
    notIncluded: [],
    popular: true,
    color: 'border-red-600'
  },
  {
    id: 'YEARLY',
    name: 'Premium Yearly',
    price: 2990,
    duration: 'per year',
    originalPrice: 3588,
    description: 'Best value - Save 17% with annual plan',
    features: [
      'Everything in Monthly',
      'Best savings',
      'Exclusive content access',
      'Creator meet & greet opportunities',
      'Merchandise discounts',
      'Annual JHFlix events access'
    ],
    notIncluded: [],
    popular: false,
    color: 'border-purple-600'
  }
]

export function SubscriptionPlans({ isOpen, onClose, onPlanSelect, currentPlan }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId)
    
    if (planId === 'FREE') {
      // Handle free plan selection
      onPlanSelect?.(plans.find(p => p.id === planId))
      onClose()
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const selectedPlanData = plans.find(p => p.id === planId)
      onPlanSelect?.(selectedPlanData)
      onClose()
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'MONTHLY':
        return <Star className="w-6 h-6" />
      case 'YEARLY':
        return <Crown className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your JHFlix Experience
          </DialogTitle>
          <p className="text-center text-gray-400">
            Stream unlimited Jharkhand content with plans tailored for you
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-gray-800 border-2 ${
                plan.popular ? plan.color : 'border-gray-700'
              } hover:border-red-500 transition-all ${
                currentPlan === plan.id ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-600 text-white px-3 py-1">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              {currentPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">
                    CURRENT PLAN
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    plan.id === 'FREE' ? 'bg-gray-700' :
                    plan.id === 'MONTHLY' ? 'bg-red-600' :
                    'bg-purple-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-400 text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.duration}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{plan.originalPrice}/year
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 opacity-50">
                      <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isProcessing || currentPlan === plan.id}
                  className={`w-full ${
                    plan.id === 'FREE' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : plan.id === 'MONTHLY'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {currentPlan === plan.id 
                    ? 'Current Plan' 
                    : plan.id === 'FREE' 
                      ? 'Continue with Free'
                      : isProcessing
                        ? 'Processing...'
                        : `Subscribe Now`
                  }
                </Button>

                {plan.id !== 'FREE' && (
                  <p className="text-xs text-gray-400 text-center">
                    Cancel anytime • No hidden fees
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Why Choose Premium?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🎬 Exclusive Content</h4>
              <p className="text-gray-400">Access premium Jharkhand movies, shows, and music not available anywhere else</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📱 Offline Viewing</h4>
              <p className="text-gray-400">Download your favorite content and watch anywhere, anytime without internet</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">👥 Family Sharing</h4>
              <p className="text-gray-400">Create up to 5 profiles with personalized recommendations for each family member</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-3">Secure payment methods</p>
          <div className="flex justify-center space-x-4">
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
              CARD
            </div>
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
              UPI
            </div>
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
              NETB
            </div>
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
              WALLET
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}