'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import FileUploader from '../../components/FileUploader'
import { usePetReconstruction } from '../../context/PetReconstructionContext'
import {
  Heart,
  Camera,
  Video,
  Mic,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PawPrint,
  User,
  MessageSquare,
  Upload
} from 'lucide-react'

function OnboardingContent() {
  const { files, setFiles, config, setConfig } = usePetReconstruction()
  const [activeStep, setActiveStep] = useState(1)
  const [petInfo, setPetInfo] = useState({
    name: '',
    breed: '',
    personality: ''
  })

  useEffect(() => {
    if (config.petName !== undefined && config.petName !== '') {
      setPetInfo(prev => ({
        ...prev,
        name: config.petName,
        breed: config.breed || '',
        personality: config.personality || ''
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const steps = [
    { id: 1, icon: <User className="w-5 h-5" />, title: '基本信息', desc: '记录宠物的身份' },
    { id: 2, icon: <MessageSquare className="w-5 h-5" />, title: '性格特征', desc: '描述独特个性' },
    { id: 3, icon: <Upload className="w-5 h-5" />, title: '上传照片', desc: '上传宠物影像' }
  ]

  const handleNext = () => {
    if (activeStep === 1) {
      setConfig({
        ...config,
        petName: petInfo.name,
        breed: petInfo.breed,
        personality: petInfo.personality
      })
      setActiveStep(prev => prev + 1)
    } else if (activeStep < 3) {
      setActiveStep(prev => prev + 1)
    } else {
      if (files.length >= 3) {
        window.location.href = '/pet-reconstruction/generate'
      } else {
        window.location.href = '/pet-reconstruction/upload'
      }
    }
  }

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-primary-50 to-gold-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面头部 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 shadow-xl mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              创建数字宠物记忆
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              录入您宠物的信息与照片，AI将为您生成栩栩如生的2D动态数字伴侣
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                    activeStep >= step.id 
                      ? 'bg-gradient-to-br from-primary-500 to-gold-400 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-400'
                  } ${activeStep === step.id ? 'ring-4 ring-primary-100' : ''}`}>
                    {activeStep > step.id ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    activeStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 md:w-32 h-1 mx-4 rounded transition-all duration-500 ${
                    activeStep > step.id ? 'bg-gradient-to-r from-primary-500 to-gold-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 主内容卡片 */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-100 to-transparent rounded-full -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gold-100 to-transparent rounded-full -ml-24 -mb-24 opacity-50"></div>

            <div className="relative z-10">
              {/* Step 1: 基本信息 */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                      <PawPrint className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">告诉我关于您宠物的基本信息</h2>
                    <p className="text-gray-600">这些信息将帮助AI更好地理解您的宠物</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        宠物姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={petInfo.name}
                        onChange={(e) => setPetInfo({...petInfo, name: e.target.value})}
                        placeholder="例如：豆豆、咪咪"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        宠物品种 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={petInfo.breed}
                        onChange={(e) => setPetInfo({...petInfo, breed: e.target.value})}
                        placeholder="例如：金毛、英短、柯基"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-2xl mx-auto">
                    <label className="block text-sm font-semibold text-gray-700">
                      性格特征描述
                    </label>
                    <textarea
                      value={petInfo.personality}
                      onChange={(e) => setPetInfo({...petInfo, personality: e.target.value})}
                      placeholder="描述您宠物的性格特点... 例如：粘人爱撒娇、活泼好动、温顺安静、聪明伶俐、有点小调皮..."
                      rows={4}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500">详细描述有助于AI更准确地还原宠物神态</p>
                  </div>
                </div>
              )}

              {/* Step 2: 性格特征 */}
              {activeStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-100 mb-4">
                      <MessageSquare className="w-8 h-8 text-gold-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">选择您宠物的性格标签</h2>
                    <p className="text-gray-600">多选可以帮助AI更好地捕捉性格特点</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {[
                      { emoji: '😺', label: '粘人亲昵', value: 'clingy' },
                      { emoji: '🎾', label: '活泼好动', value: 'playful' },
                      { emoji: '🌙', label: '安静温顺', value: 'calm' },
                      { emoji: '🧠', label: '聪明机灵', value: 'smart' },
                      { emoji: '😈', label: '调皮捣蛋', value: 'naughty' },
                      { emoji: '💤', label: '懒散嗜睡', value: 'lazy' },
                      { emoji: '🛡️', label: '勇敢护主', value: 'brave' },
                      { emoji: '🤗', label: '友善亲人', value: 'friendly' },
                      { emoji: '👑', label: '高冷傲娇', value: 'aloof' },
                    ].map((trait) => (
                      <button
                        key={trait.value}
                        onClick={() => {
                          const current = config.personalityTags || []
                          const newTags = current.includes(trait.value)
                            ? current.filter(t => t !== trait.value)
                            : [...current, trait.value]
                          setConfig({ ...config, personalityTags: newTags })
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                          (config.personalityTags || []).includes(trait.value)
                            ? 'border-primary-500 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{trait.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{trait.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="max-w-2xl mx-auto mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 flex items-start">
                      <Sparkles className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>提示：</strong>选择的性格标签会影响生成宠物的表情和动作风格。例如选择"粘人亲昵"会让宠物更多地显示依恋的表情。</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: 上传照片 - 集成真实的文件上传组件 */}
              {activeStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-100 mb-4">
                      <Camera className="w-8 h-8 text-pink-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">上传您宠物的珍贵照片</h2>
                    <p className="text-gray-600">
                      AI将基于这些照片生成逼真的2D动态宠物形象
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <FileUploader files={files} setFiles={setFiles} />
                  </div>

                  <div className="max-w-3xl mx-auto mt-6 p-6 bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl border border-primary-200">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-primary-500" />
                      照片建议
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>上传<strong>3-10张</strong>清晰的正脸或侧面照片</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>选择不同角度和表情的照片，效果更佳</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>支持JPG/PNG/WebP格式，单张不超过10MB</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>也可上传视频（MP4/WebM），AI会自动提取关键帧</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 导航按钮 */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrev}
                  disabled={activeStep === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span>上一步</span>
                </button>

                <button
                  onClick={handleNext}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    activeStep === 3
                      ? files.length >= 3
                        ? 'bg-gradient-to-r from-primary-500 via-gold-500 to-orange-500 text-white hover:shadow-2xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-xl'
                  }`}
                  disabled={activeStep === 3 && files.length < 3}
                >
                  <span>{activeStep === 3 ? '开始AI重建 🚀' : '下一步'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {activeStep === 3 && files.length < 3 && (
                <p className="text-center mt-4 text-sm text-red-500 animate-pulse">
                  ⚠️ 请至少上传3张照片才能开始AI重建
                </p>
              )}
            </div>
          </div>

          {/* 底部说明 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              完成以上步骤后，AI将在30秒内为您生成专属的2D动态数字宠物 💫
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return <OnboardingContent />
}
