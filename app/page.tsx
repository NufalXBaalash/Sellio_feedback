'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import AlertModal from '../components/alert-modal'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [formData, setFormData] = useState({
    email: '',
    isUseful: '',
    feedback: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  // Function to scroll to feedback form
  const scrollToFeedback = () => {
    const feedbackSection = document.getElementById('feedback-form')
    if (feedbackSection) {
      feedbackSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      
      // Add a subtle highlight effect
      setTimeout(() => {
        feedbackSection.style.transform = 'scale(1.02)'
        feedbackSection.style.transition = 'transform 0.3s ease'
        setTimeout(() => {
          feedbackSection.style.transform = 'scale(1)'
        }, 300)
      }, 500)
    }
  }

  const translations = {
    en: {
      title: 'SELLIOai',
      subtitle: 'The Ultimate E-commerce Automation Platform',
      description: 'SELLIOai is a revolutionary website and app that simplifies e-commerce and selling. It automatically responds to customers, shows them products, explains all details, takes shipping information, creates orders, and handles shipping - all while you relax and just post on your social media pages.',
      features: {
        products: {
          title: 'Smart Product Management',
          description: 'Automatically showcase your products with AI-powered descriptions and smart categorization'
        },
        customers: {
          title: 'AI Customer Service', 
          description: '24/7 automated customer support via WhatsApp and Instagram that responds instantly to inquiries'
        },
        orders: {
          title: 'Automated Order Processing',
          description: 'Seamless order creation, payment processing, and shipping coordination without manual intervention'
        },
        analytics: {
          title: 'Intelligent Analytics',
          description: 'AI-driven insights about your sales performance and customer behavior patterns'
        }
      },
      question: 'Do you think SELLIOai would be useful for you as a store owner?',
      options: {
        yes: '✅ Yes, it would be very useful',
        no: '❌ No, I don\'t think it would be useful'
      },
      emailLabel: 'Email (for exclusive launch discount)',
      feedbackLabel: 'Share your thoughts',
      feedbackPlaceholder: 'What do you think about SELLIOai? What features interest you most?',
      submit: 'Submit Feedback',
      submitting: 'Submitting...',
      success: {
        title: 'Thank You!',
        message: 'Your feedback has been received successfully. We\'ll contact you soon with an exclusive launch discount!',
        discount: '🎉 You\'ll receive a special launch discount via email!'
      },
      tryNow: 'Want to try SELLIOai now?',
      discountSection: {
        title: '🎉 Exclusive Launch Discount!',
        subtitle: 'Be among the first to experience SELLIOai',
        description: 'Sign up now and get a special discount when we launch!',
        features: [
          'Early access to all features',
          'Special launch pricing',
          'Priority customer support',
          'Exclusive updates'
        ],
        cta: 'Get Your Discount Now!'
      }
    },
    ar: {
      title: 'SELLIOai',
      subtitle: 'منصة أتمتة التجارة الإلكترونية الرائدة',
      description: 'SELLIOai هو موقع وتطبيق ثوري يبسط التجارة الإلكترونية والبيع. يرد تلقائياً على العملاء، ويعرض لهم المنتجات، ويشرح جميع التفاصيل، ويأخذ معلومات الشحن، وينشئ الطلبات، ويتولى الشحن - كل هذا وأنت مستريح وتنشر فقط على صفحاتك الاجتماعية.',
      features: {
        products: {
          title: 'إدارة المنتجات الذكية',
          description: 'عرض منتجاتك تلقائياً مع أوصاف مدعومة بالذكاء الاصطناعي وتصنيف ذكي'
        },
        customers: {
          title: 'خدمة العملاء بالذكاء الاصطناعي',
          description: 'دعم عملاء آلي على مدار الساعة عبر واتساب وإنستجرام يرد فوراً على الاستفسارات'
        },
        orders: {
          title: 'معالجة الطلبات الآلية',
          description: 'إنشاء طلبات سلس، ومعالجة المدفوعات، وتنسيق الشحن دون تدخل يدوي'
        },
        analytics: {
          title: 'تحليلات ذكية',
          description: 'رؤى مدعومة بالذكاء الاصطناعي حول أداء مبيعاتك وأنماط سلوك العملاء'
        }
      },
      question: 'هل تعتقد أن SELLIOai سيكون مفيداً لك كصاحب متجر؟',
      options: {
        yes: 'نعم، سيكون مفيداً جداً',
        no: 'لا، لا أعتقد أنه سيكون مفيداً'
      },
      emailLabel: 'البريد الإلكتروني (للحصول على خصم حصري عند الإطلاق)',
      feedbackLabel: 'شاركنا رأيك',
      feedbackPlaceholder: 'ما رأيك في SELLIOai؟ ما الميزات التي تهمك أكثر؟',
      submit: 'إرسال رأيك',
      submitting: 'جاري الإرسال...',
      success: {
        title: 'شكراً لك!',
        message: 'تم استلام رأيك بنجاح. سنتواصل معك قريباً مع خصم حصري عند الإطلاق!',
        discount: '🎉 ستحصل على خصم خاص عند الإطلاق عبر البريد الإلكتروني!'
      },
      tryNow: 'تريد تجربة SELLIOai الآن؟',
      discountSection: {
        title: '🎉 خصم حصري عند الإطلاق!',
        subtitle: 'كن من أوائل من يجرب SELLIOai',
        description: 'سجل الآن واحصل على خصم خاص عند إطلاقنا!',
        features: [
          'وصول مبكر لجميع الميزات',
          'أسعار إطلاق خاصة',
          'دعم عملاء أولوية',
          'تحديثات حصرية'
        ],
        cta: 'احصل على خصمك الآن!'
      },
    }
  }

  const t = translations[language as keyof typeof translations]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ email: '', isUseful: '', feedback: '' })
      } else {
        setAlert({
          isOpen: true,
          type: 'error',
          title: language === 'ar' ? 'خطأ' : 'Error',
          message: language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again'
        })
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: language === 'ar' ? 'خطأ' : 'Error',
        message: language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
        >
          <div className="mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {t.success.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-gray-600 mb-4"
            >
              {t.success.message}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <p className="text-green-700 font-medium text-center">
                {t.success.discount}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Language Switcher */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 flex gap-1 shadow-lg border border-gray-200">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer select-none flex items-center gap-2 ${
              language === 'en' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
            style={{ minWidth: '60px', textAlign: 'center' }}
          >
            <Globe size={16} />
            EN
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('ar')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer select-none flex items-center gap-2 ${
              language === 'ar' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
            style={{ minWidth: '60px', textAlign: 'center' }}
          >
            <Globe size={16} />
            عربي
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-20 pb-16 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            {t.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Discount Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 px-4 pb-16"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-green-100 relative overflow-hidden"
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-blue-400/10 animate-pulse"></div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 right-4 text-6xl opacity-20"
            >
              🎉
            </motion.div>
            
            <motion.div 
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-4 left-4 text-4xl opacity-20"
            >
              💎
            </motion.div>

            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-center mb-8"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4"
                >
                  {t.discountSection.title}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-xl text-gray-700 mb-2"
                >
                  {t.discountSection.subtitle}
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="text-lg text-gray-600"
                >
                  {t.discountSection.description}
                </motion.p>
              </motion.div>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="grid md:grid-cols-2 gap-4 mb-8"
              >
                {t.discountSection.features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center p-4 bg-white/60 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300"
                  >
                    <motion.div 
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className="text-2xl mr-3"
                    >
                      ✨
                    </motion.div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
                className="text-center"
              >
                <motion.button
                  suppressHydrationWarning
                  onClick={scrollToFeedback}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 10px 30px rgba(34, 197, 94, 0.2)",
                      "0 15px 35px rgba(34, 197, 94, 0.3)",
                      "0 10px 30px rgba(34, 197, 94, 0.2)"
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 via-green-600 to-blue-600 hover:from-green-600 hover:via-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl text-lg transition-all duration-300 cursor-pointer"
                >
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
                    style={{
                      backgroundSize: "200% 100%"
                    }}
                  >
                    {t.discountSection.cta}
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 px-4 pb-16"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.features.products.title}</h3>
              <p className="text-gray-600">{t.features.products.description}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.features.customers.title}</h3>
              <p className="text-gray-600">{t.features.customers.description}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.features.orders.title}</h3>
              <p className="text-gray-600">{t.features.orders.description}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.features.analytics.title}</h3>
              <p className="text-gray-600">{t.features.analytics.description}</p>
            </motion.div>
          </div>

          {/* Feedback Form */}
          <motion.div 
            id="feedback-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white max-w-2xl mx-auto p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              {t.question}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="space-y-4">
                  <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="isUseful"
                        value="yes"
                        checked={formData.isUseful === 'yes'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        formData.isUseful === 'yes' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 group-hover:border-green-400'
                      }`}>
                        {formData.isUseful === 'yes' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium mr-3">{t.options.yes}</span>
                  </label>
                  <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="isUseful"
                        value="no"
                        checked={formData.isUseful === 'no'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        formData.isUseful === 'no' 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 group-hover:border-green-400'
                      }`}>
                        {formData.isUseful === 'no' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium mr-3">{t.options.no}</span>
                  </label>
                </div>
              </div>

              {(formData.isUseful === 'yes' || formData.isUseful === 'no') && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.feedbackLabel}
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
                      placeholder={t.feedbackPlaceholder}
                    />
                  </div>
                </>
              )}

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!formData.isUseful || !formData.feedback.trim() || isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.submitting}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

        </div>
      </motion.div>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  )
}
