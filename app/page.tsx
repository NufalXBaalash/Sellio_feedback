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
    titleLine2: "social media sales",
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
    titleLine2: "على وسائل التواصل",
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
    <div
      className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
      style={isAr ? { fontSize: '0.93em' } : {}}
    >
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo/dark.png" alt="SellioAI Logo" className="h-10 md:h-12 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">SellioAI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isAr ? 'English' : 'عربي'}
            </button>
            <button onClick={scrollToWaitlist} className="hidden sm:block text-sm font-semibold text-white bg-[#27AE60] hover:bg-[#219a52] px-5 py-2 rounded-full transition-all shadow-[0_4px_15px_rgba(39,174,96,0.25)] hover:shadow-[0_4px_20px_rgba(39,174,96,0.4)]">
              {t.navJoin}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 px-4 sm:px-6 min-h-[85vh] flex flex-col items-center justify-center text-center z-10 overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white border border-[#27AE60]/30 text-xs sm:text-sm font-medium text-[#27AE60] mb-6 sm:mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
            {t.waitlistOpen}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900"
          >
            {t.titleLine1}<br />
            {t.titleLine2} <span className="text-[#27AE60] relative inline-block">
              {t.titleHighlight}
              <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-[#27AE60]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            {t.description}
            <strong className="text-gray-900 font-bold"> {t.discountHighlight}</strong>
            {t.uponRelease}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          >
            <button 
              onClick={scrollToWaitlist}
              className="group w-full sm:w-auto h-13 sm:h-14 px-7 sm:px-8 rounded-full bg-[#27AE60] text-white font-bold text-base sm:text-lg hover:bg-[#219a52] transition-colors flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(39,174,96,0.3)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.45)] hover:-translate-y-0.5 duration-300"
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
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative z-20 border-t border-gray-200/60 bg-white/60 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center mb-10 md:mb-20"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#27AE60] mb-4 bg-[#27AE60]/10 px-4 py-1.5 rounded-full border border-[#27AE60]/20 shadow-[0_0_10px_rgba(39,174,96,0.1)]">
              {t.featuresLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-5 text-gray-900">
              {t.featuresTitle}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
              {t.featuresDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-min md:auto-rows-[300px] gap-6">
            
            {/* 1. AI Store Creation (Large/Hero Card) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-10 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 group min-h-[300px] md:min-h-0"
            >
              <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_rgba(39,174,96,0.15),_transparent_50%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-6">
                    <Store className="w-7 h-7 text-[#27AE60]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{t.storeTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-base md:text-lg max-w-md">
                    {t.storeDesc}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-4 md:p-6 border border-gray-100 shadow-inner relative flex flex-col justify-center items-center mt-8 flex-1">
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5, delay: 0.3 }}
                     className="w-full flex items-center gap-3 p-4 border border-[#27AE60]/20 bg-[#27AE60]/5 rounded-2xl shadow-sm mb-4"
                   >
                     <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                       <Bot className="w-6 h-6 text-[#27AE60]" />
                     </motion.div>
                     <span className="text-sm text-gray-700 font-medium">{isAr ? "إنشاء متجر للملابس الصيفية..." : "Creating Summer Clothing Store..."}</span>
                   </motion.div>
                   <div className="w-[85%] h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                     <motion.div 
                       initial={{ width: "0%" }}
                       whileInView={{ width: "100%" }}
                       transition={{ duration: 3, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
                       className="h-full bg-gradient-to-r from-[#27AE60]/50 to-[#27AE60]" 
                     />
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
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 group min-h-[300px] md:min-h-0"
            >
              <div className="absolute bottom-0 right-0 w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_bottom_right,_rgba(39,174,96,0.1),_transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 md:gap-8 h-full items-center">
                <div className="flex-1 w-full text-center sm:text-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Package className="w-6 h-6 text-[#27AE60]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t.crmTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {t.crmDesc}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 shadow-inner w-full sm:w-1/2 mt-4 sm:mt-0">
                  {[
                    { title: isAr ? 'تم تحديث المخزون' : 'Inventory Updated', time: '2m ago' },
                    { title: isAr ? 'تم تأكيد طلب جديد' : 'New Order Confirmed', time: '15m ago' }
                  ].map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + (i * 0.2) }}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                        transition={{ duration: 2, repeat: Infinity, delay: i }}
                        className={`w-2 h-2 rounded-full bg-[#27AE60]`} 
                      />
                      <div className="flex-1 text-start">
                        <div className="font-semibold text-xs text-gray-800">{log.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{log.time}</div>
                      </div>
                    </motion.div>
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
              className="lg:col-span-1 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col min-h-[250px] md:min-h-0"
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-5 mt-auto"
              >
                <MessageCircle className="w-6 h-6 text-[#27AE60]" />
              </motion.div>
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
              className="lg:col-span-1 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col min-h-[250px] md:min-h-0"
            >
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center mb-5 mt-auto"
              >
                <TrendingUp className="w-6 h-6 text-[#27AE60]" />
              </motion.div>
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
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col justify-center min-h-[250px] md:min-h-0"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 shrink-0 rounded-3xl bg-[#27AE60]/20 shadow-[0_0_15px_rgba(39,174,96,0.2)] border border-[#27AE60]/30 flex items-center justify-center"
                >
                  <Clock className="w-8 h-8 text-[#27AE60]" />
                </motion.div>
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
              className="md:col-span-2 lg:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-6 md:p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(39,174,96,0.08)] transition-shadow duration-500 flex flex-col justify-center min-h-[250px] md:min-h-0"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.socialTitle}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {t.socialDesc}
                  </p>
                </div>
                {/* Official SVGs from simpleicons */}
                <div className="flex justify-center gap-4 shrink-0 flex-wrap mt-4 sm:mt-0">
                  <motion.img whileHover={{ scale: 1.2, rotate: 10 }} src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp" className="w-10 h-10 cursor-pointer" />
                  <motion.img whileHover={{ scale: 1.2, rotate: -10 }} src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram" className="w-10 h-10 cursor-pointer" />
                  <motion.img whileHover={{ scale: 1.2, rotate: 10 }} src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" className="w-10 h-10 cursor-pointer" />
                  <motion.img whileHover={{ scale: 1.2, rotate: -10 }} src="https://cdn.simpleicons.org/x/111111" alt="X" className="w-9 h-9 cursor-pointer" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist-form" className="py-14 sm:py-20 md:py-32 px-4 sm:px-6 relative bg-gray-50/80 border-t border-gray-200/60 z-20">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="bg-white p-6 md:p-14 rounded-[3rem] shadow-[0_20px_60px_rgba(39,174,96,0.08),0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(39,174,96,0.1),_transparent_50%)] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#27AE60]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#27AE60]/20">
                  <Heart className="w-8 h-8 text-[#27AE60] fill-[#27AE60]/30" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">{t.secureSpotTitle}</h2>
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
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
                  className="w-full mt-4 bg-[#27AE60] hover:bg-[#219a52] text-white font-bold py-3.5 sm:py-4 px-8 rounded-2xl shadow-[0_4px_20px_rgba(39,174,96,0.25)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base sm:text-lg"
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
      <footer className="relative z-20 bg-white border-t border-gray-100">
        {/* Main footer body */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo/dark.png" alt="SellioAI Logo" className="h-9 w-auto object-contain" />
              <span className="text-lg font-bold tracking-tight text-gray-900">SellioAI</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
              {isAr
                ? 'منصة الذكاء الاصطناعي لأتمتة مبيعاتك عبر وسائل التواصل الاجتماعي.'
                : 'AI-powered automation for your social media sales — on autopilot.'}
            </p>
          </div>

          {/* Col 2 — Social Icons */}
          <div className="flex flex-col items-start md:items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {isAr ? 'تابعنا' : 'Follow us'}
            </p>
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <motion.a
                href="https://www.facebook.com/profile.php?id=61589088040564"
                target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.9 }}
                className="transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </motion.a>
              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/sellioai/"
                target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.9 }}
                className="transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="ig-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F58529"/>
                      <stop offset="50%" stopColor="#DD2A7B"/>
                      <stop offset="100%" stopColor="#8134AF"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#ig-footer)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </motion.a>
              {/* X */}
              <motion.a
                href="https://x.com/sellioai"
                target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.9 }}
                className="transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#111111" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </motion.a>
              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/company/sellioai/"
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.9 }}
                className="transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Col 3 — WhatsApp Contact */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {isAr ? 'تواصل معنا' : 'Contact us'}
            </p>
            <div className="flex flex-col gap-2">
              {['+201031923884', '+201008992523'].map((num) => (
                <motion.a
                  key={num}
                  href={`https://wa.me/${num.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: isAr ? -4 : 4 }}
                  className="group flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#25D366] transition-colors duration-300 font-medium"
                >
                  {/* WhatsApp icon */}
                                        <span className="w-7 h-7 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  <span dir="ltr">{num}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 py-5">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} SellioAI. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
