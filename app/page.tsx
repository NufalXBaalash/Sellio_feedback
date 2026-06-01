'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Package, 
  ArrowRight,
  ArrowLeft,
  Globe,
  Heart,
  Store,
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Animated Hero Background
const AnimatedHeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Soft animated gradient orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#27AE60]/5 blur-[100px] rounded-full"
    />
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#27AE60]/5 blur-[120px] rounded-full"
    />
    
    {/* Animated subtle grid */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2 }}
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(to right, #27AE60 1px, transparent 1px), linear-gradient(to bottom, #27AE60 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)'
      }}
    />
  </div>
)

const translations = {
  en: {
    waitlistOpen: "SellioAI Waitlist is Open",
    titleLine1: "Automate your",
    titleLine2: "WhatsApp sales",
    titleHighlight: "instantly.",
    description: "SellioAI is your all-in-one automated assistant. It takes orders, scores leads, manages inventory, and handles social media—completely on autopilot. Join today for an exclusive ",
    discountHighlight: "50% discount",
    uponRelease: " upon release.",
    claimButton: "Claim 50% Off Now",
    featuresLabel: "Superpowers",
    featuresTitle: "Everything you need to scale",
    featuresDesc: "A powerful suite of AI tools designed to put your social commerce on autopilot.",
    
    storeTitle: "AI Store Creation",
    storeDesc: "Launch an entire e-commerce store instantly using AI. Just tell the assistant what you sell and it handles the rest.",
    assistantTitle: "AI Helping Assistant",
    assistantDesc: "Your personal AI co-pilot that handles customer inquiries, showcases products, and manages operations 24/7.",
    crmTitle: "Automated CRM & ERP",
    crmDesc: "A complete backend system that manages your inventory, coordinates shipping, and tracks orders without manual intervention.",
    scoringTitle: "Lead Scoring",
    scoringDesc: "Instantly identify high-intent buyers. The AI analyzes customer behavior and scores leads so you know who is ready to buy.",
    followupTitle: "AI Followups",
    followupDesc: "Never lose a sale. The AI automatically follows up with interested customers and abandoned carts at the perfect time.",
    socialTitle: "Social Media Integration",
    socialDesc: "Connect your social accounts and let the AI automatically respond to customer messages and comments across all platforms.",
    
    secureSpotTitle: "Secure Your Spot",
    secureSpotDesc: "Join the waitlist today. We'll send you a ",
    couponHighlight: "50% off coupon",
    secureSpotDescEnd: " and notify you when SellioAI is ready for you.",
    emailLabel: "Email Address *",
    feedbackLabel: "What features are you most excited about?",
    optional: "Optional",
    joinButton: "Join Waitlist & Get 50% Off",
    successTitle: "You're on the list!",
    successDesc: "Thank you for applying! We've sent a confirmation email to your inbox. Keep waiting for the full release of SellioAI!",
    successCoupon: "🎉 Your 50% off coupon is secured!",
    errorMsg: "An error occurred. Please try again.",
    placeholderEmail: "you@example.com",
    placeholderFeedback: "Tell us what you'd like to see in SellioAI...",
    navJoin: "Join Waitlist"
  },
  ar: {
    waitlistOpen: "قائمة الانتظار في SellioAI مفتوحة الآن",
    titleLine1: "أتمتة مبيعاتك",
    titleLine2: "على واتساب",
    titleHighlight: "في ثوانٍ.",
    description: "SellioAI هو مساعدك الآلي المتكامل. يتلقى الطلبات، يقيم العملاء، يدير المخزون، ويتعامل مع وسائل التواصل—تلقائياً بالكامل. انضم اليوم واحصل على ",
    discountHighlight: "خصم 50%",
    uponRelease: " عند الإطلاق الرسمي.",
    claimButton: "احصل على خصم 50% الآن",
    featuresLabel: "القدرات الخارقة",
    featuresTitle: "كل ما تحتاجه للنمو",
    featuresDesc: "مجموعة أدوات ذكية مصممة لوضع تجارتك على وضع الطيران الآلي.",
    
    storeTitle: "إنشاء متجر بالذكاء الاصطناعي",
    storeDesc: "إنشاء متجر إلكتروني متكامل فوراً. فقط أخبر المساعد بما تبيعه وسيتكفل بالباقي.",
    assistantTitle: "المساعد الذكي الشخصي",
    assistantDesc: "مساعدك الشخصي الذي يتولى استفسارات العملاء، ويعرض المنتجات، ويدير العمليات على مدار الساعة.",
    crmTitle: "نظام إدارة متكامل",
    crmDesc: "نظام خلفي متكامل يدير المخزون، وينسق الشحن، ويتتبع الطلبات بدون أي تدخل يدوي.",
    scoringTitle: "نظام تقييم العملاء",
    scoringDesc: "التعرف الفوري على المشترين الجادين. الذكاء الاصطناعي يحلل سلوك العملاء لتعرف من مستعد للشراء.",
    followupTitle: "المتابعة الآلية للعملاء",
    followupDesc: "لا تفقد أي مبيعات. الذكاء الاصطناعي يتابع العملاء المهتمين والسلال المتروكة تلقائياً.",
    socialTitle: "ربط منصات التواصل",
    socialDesc: "اربط حساباتك ودع الذكاء الاصطناعي يرد تلقائياً على رسائل وتعليقات العملاء في كل مكان.",
    
    secureSpotTitle: "احجز مكانك الآن",
    secureSpotDesc: "انضم إلى قائمة الانتظار اليوم. سنرسل لك ",
    couponHighlight: "قسيمة خصم 50%",
    secureSpotDescEnd: " وسنعلمك فور إطلاق SellioAI.",
    emailLabel: "البريد الإلكتروني *",
    feedbackLabel: "ما هي الميزات التي تتحمس لها أكثر؟",
    optional: "اختياري",
    joinButton: "انضم للقائمة واحصل على خصم 50%",
    successTitle: "تم تسجيلك بنجاح!",
    successDesc: "شكراً لتقديمك! لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. ترقب الإطلاق الكامل لـ SellioAI قريباً!",
    successCoupon: "🎉 تم تأمين قسيمة الخصم 50% الخاصة بك!",
    errorMsg: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    placeholderEmail: "أنت@مثال.com",
    placeholderFeedback: "أخبرنا بما تود رؤيته في SellioAI...",
    navJoin: "الانضمام للقائمة"
  }
}

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [formData, setFormData] = useState({ email: '', feedback: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  const isAr = lang === 'ar'
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isAr])

  const scrollToWaitlist = () => {
    const form = document.getElementById('waitlist-form')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isUseful: 'yes' }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ email: '', feedback: '' })
      } else {
        setError(t.errorMsg)
      }
    } catch (err) {
      setError(t.errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8fdf9] flex items-center justify-center p-4 font-sans text-gray-700 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
        <AnimatedHeroBackground />
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 text-center relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#27AE60]/20"
            >
              <Heart className="w-10 h-10 text-[#27AE60] fill-[#27AE60]/30" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-3"
            >
              {t.successTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-gray-500 mb-6 leading-relaxed"
            >
              {t.successDesc}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-2xl p-5"
            >
              <p className="text-[#27AE60] font-bold text-lg">
                {t.successCoupon}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
              <img src="/assets/logo/dark.png" alt="SellioAI Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">SellioAI</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-4 py-2 rounded-full transition-all"
            >
              <Globe className="w-4 h-4" />
              {isAr ? 'English' : 'عربي'}
            </button>
            <button onClick={scrollToWaitlist} className="hidden sm:block text-sm font-semibold text-white bg-[#27AE60] hover:bg-[#219a52] px-6 py-2.5 rounded-full transition-all shadow-[0_4px_15px_rgba(39,174,96,0.25)] hover:shadow-[0_4px_20px_rgba(39,174,96,0.4)]">
              {t.navJoin}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[85vh] flex flex-col items-center justify-center text-center z-10 overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#27AE60]/30 text-sm font-medium text-[#27AE60] mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
            {t.waitlistOpen}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900"
          >
            {t.titleLine1}<br />
            {t.titleLine2} <span className="text-[#27AE60] relative inline-block">
              {t.titleHighlight}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#27AE60]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t.description}
            <strong className="text-gray-900 font-bold"> {t.discountHighlight}</strong>
            {t.uponRelease}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={scrollToWaitlist}
              className="group h-14 px-8 rounded-full bg-[#27AE60] text-white font-bold text-lg hover:bg-[#219a52] transition-colors flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(39,174,96,0.3)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.45)] hover:-translate-y-0.5 duration-300"
            >
              {t.claimButton}
              {isAr ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-24 px-6 relative z-20 border-t border-gray-200/60 bg-white/60 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center mb-20"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#27AE60] mb-4 bg-[#27AE60]/10 px-4 py-1.5 rounded-full border border-[#27AE60]/20 shadow-[0_0_10px_rgba(39,174,96,0.1)]">
              {t.featuresLabel}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-gray-900">
              {t.featuresTitle}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {t.featuresDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6">
            
            {/* 1. AI Store Creation (Large/Hero Card) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-8 md:p-10 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 group"
            >
              <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_rgba(39,174,96,0.15),_transparent_50%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-6">
                    <Store className="w-7 h-7 text-[#27AE60]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">{t.storeTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg max-w-md">
                    {t.storeDesc}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 shadow-inner relative flex flex-col justify-center items-center mt-8 flex-1">
                   <div className="w-full flex items-center gap-3 p-4 border border-[#27AE60]/20 bg-[#27AE60]/5 rounded-2xl shadow-sm mb-4">
                     <Bot className="w-6 h-6 text-[#27AE60]" />
                     <span className="text-sm text-gray-700 font-medium">{isAr ? "إنشاء متجر للملابس الصيفية..." : "Creating Summer Clothing Store..."}</span>
                   </div>
                   <div className="w-[85%] h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                     <div className="w-full h-full bg-gradient-to-r from-[#27AE60]/50 to-[#27AE60] animate-pulse" />
                   </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Automated CRM & ERP (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 group"
            >
              <div className="absolute bottom-0 right-0 w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_bottom_right,_rgba(39,174,96,0.1),_transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-8 h-full items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-[#27AE60]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.crmTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {t.crmDesc}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 shadow-inner w-full sm:w-1/2">
                  {[
                    { title: isAr ? 'تم تحديث المخزون' : 'Inventory Updated', time: '2m ago' },
                    { title: isAr ? 'تم تأكيد طلب جديد' : 'New Order Confirmed', time: '15m ago' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className={`w-2 h-2 rounded-full bg-[#27AE60]`} />
                      <div className="flex-1">
                        <div className="font-semibold text-xs text-gray-800">{log.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 3. AI Helping Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="lg:col-span-1 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-5 mt-auto">
                <MessageCircle className="w-6 h-6 text-[#27AE60]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{t.assistantTitle}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.assistantDesc}
              </p>
            </motion.div>

            {/* 4. Lead Scoring System */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="lg:col-span-1 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-5 mt-auto">
                <TrendingUp className="w-6 h-6 text-[#27AE60]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{t.scoringTitle}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.scoringDesc}
              </p>
            </motion.div>

            {/* 5. AI Followups (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col justify-center"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 shrink-0 rounded-3xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-[#27AE60]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.followupTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {t.followupDesc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 6. Social Media Integration (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col justify-center"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.socialTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {t.socialDesc}
                  </p>
                </div>
                {/* Official SVGs from simpleicons */}
                <div className="flex justify-center gap-4 shrink-0">
                  <img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp" className="w-10 h-10 hover:scale-110 transition-transform duration-300" />
                  <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram" className="w-10 h-10 hover:scale-110 transition-transform duration-300" />
                  <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" className="w-10 h-10 hover:scale-110 transition-transform duration-300" />
                  <img src="https://cdn.simpleicons.org/x/111111" alt="X" className="w-9 h-9 hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist-form" className="py-32 px-6 relative bg-gray-50/80 border-t border-gray-200/60 z-20">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_rgba(39,174,96,0.08),0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(39,174,96,0.1),_transparent_50%)] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#27AE60]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#27AE60]/20">
                  <Heart className="w-8 h-8 text-[#27AE60] fill-[#27AE60]/30" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{t.secureSpotTitle}</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {t.secureSpotDesc}
                  <strong className="text-[#27AE60] bg-[#27AE60]/10 border border-[#27AE60]/20 px-2 py-0.5 rounded-md mx-1">{t.couponHighlight}</strong>
                  {t.secureSpotDescEnd}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none placeholder:text-gray-400 shadow-sm"
                    placeholder={t.placeholderEmail}
                  />
                </div>

                <div>
                  <label htmlFor="feedback" className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                    <span>{t.feedbackLabel}</span>
                    <span className="text-gray-400 text-xs font-medium bg-gray-100 border border-gray-200 px-2 py-1 rounded-md">{t.optional}</span>
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none resize-none placeholder:text-gray-400 shadow-sm"
                    placeholder={t.placeholderFeedback}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!formData.email || isLoading}
                  className="w-full mt-4 bg-[#27AE60] hover:bg-[#219a52] text-white font-bold py-4 px-8 rounded-2xl shadow-[0_4px_20px_rgba(39,174,96,0.25)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                  ) : (
                    <>
                      {t.joinButton}
                      {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-400 border-t border-gray-200/60 bg-white z-20 relative">
        <p>© {new Date().getFullYear()} SellioAI. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  )
}
