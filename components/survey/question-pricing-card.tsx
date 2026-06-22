'use client'

import { Check } from 'lucide-react'

// NOTE: These plan tiers are placeholders. The real figures live on
// sellioai.com/pricing (JS-rendered). Replace PRICING_PLANS below with the
// actual plan names, prices, and features when they are confirmed.
export interface PricingPlan {
  key: string
  name: string
  nameAr: string
  price: string      // already-localized price string, e.g. "499 EGP"
  period: string
  periodAr: string
  highlighted?: boolean
  features: string[]
  featuresAr: string[]
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    key: 'starter',
    name: 'Starter',
    nameAr: 'ستارتر',
    price: '199',
    period: '/mo',
    periodAr: '/شهر',
    features: ['1 AI agent', 'Instagram & WhatsApp', 'Basic analytics'],
    featuresAr: ['وكيل ذكي واحد', 'إنستغرام وواتساب', 'تحليلات أساسية'],
  },
  {
    key: 'growth',
    name: 'Growth',
    nameAr: 'جروث',
    price: '499',
    period: '/mo',
    periodAr: '/شهر',
    highlighted: true,
    features: ['3 AI agents', 'Order management', 'Advanced analytics', 'Priority support'],
    featuresAr: ['٣ وكلاء ذكيين', 'إدارة الطلبات', 'تحليلات متقدمة', 'دعم مميز'],
  },
  {
    key: 'pro',
    name: 'Pro',
    nameAr: 'برو',
    price: '999',
    period: '/mo',
    periodAr: '/شهر',
    features: ['Unlimited agents', 'Multi-store', 'Custom integrations', 'Dedicated manager'],
    featuresAr: ['وكلاء بلا حدود', 'متاجر متعددة', 'تكاملات مخصصة', 'مدير حساب مخصص'],
  },
]

interface QuestionPricingCardProps {
  isAr?: boolean
  currency?: string
  plans?: PricingPlan[]
}

export default function QuestionPricingCard({ isAr = false, currency = 'EGP', plans = PRICING_PLANS }: QuestionPricingCardProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-3">
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
        {plans.map((plan) => {
          const name = isAr ? plan.nameAr : plan.name
          const period = isAr ? plan.periodAr : plan.period
          const features = isAr ? plan.featuresAr : plan.features
          return (
            <div
              key={plan.key}
              className={`relative rounded-xl p-3 border text-center flex flex-col ${
                plan.highlighted
                  ? 'border-[#27AE60] bg-[#f0faf4] shadow-[0_4px_20px_rgba(39,174,96,0.12)]'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-[#27AE60] rounded-full px-2 py-0.5 uppercase tracking-wide whitespace-nowrap">
                  {isAr ? 'الأكثر شيوعاً' : 'Popular'}
                </span>
              )}
              <p className="text-xs font-bold text-gray-900">{name}</p>
              <div className="my-1.5 flex items-end justify-center gap-1">
                <span className="text-lg font-extrabold text-[#27AE60]">{plan.price}</span>
                <span className="text-[10px] text-gray-400 mb-0.5">{currency}{period}</span>
              </div>
              <ul className="space-y-1 mt-1 text-start">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1 text-[9px] leading-tight text-gray-500">
                    <Check className="w-2.5 h-2.5 text-[#27AE60] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <p className="text-center text-[9px] text-gray-300 mt-1.5">
        {isAr ? 'للعرض التوضيحي فقط — الأسعار الفعلية على sellioai.com/pricing' : 'For illustration only — actual pricing at sellioai.com/pricing'}
      </p>
    </div>
  )
}
