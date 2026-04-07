'use client'

import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { PetReconstructionProvider } from '../../context/PetReconstructionContext'
import {
  Upload,
  Settings,
  Sparkles,
  Eye,
  Monitor,
  ArrowRight,
  PawPrint
} from 'lucide-react'

function PetReconstructionContent() {
  const steps = [
    {
      number: 1,
      icon: <Upload className="w-6 h-6" />,
      title: '上传媒体',
      description: '上传您宠物的照片、视频或音频文件',
      href: '/pet-reconstruction/upload',
      color: 'from-primary-500 to-primary-600'
    },
    {
      number: 2,
      icon: <Settings className="w-6 h-6" />,
      title: '配置参数',
      description: '设置AI生成风格、质量和背景等参数',
      href: '/pet-reconstruction/generate',
      color: 'from-gold-500 to-gold-600'
    },
    {
      number: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI生成',
      description: 'AI将根据您的配置生成宠物数字形象',
      href: '/pet-reconstruction/generate',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      number: 4,
      icon: <Eye className="w-6 h-6" />,
      title: '预览效果',
      description: '查看和调整生成的宠物数字形象',
      href: '/pet-reconstruction/preview',
      color: 'from-pink-500 to-rose-600'
    },
    {
      number: 5,
      icon: <Monitor className="w-6 h-6" />,
      title: '桌面展示',
      description: '在桌面模式下展示您的数字宠物',
      href: '/pet-reconstruction/desktop',
      color: 'from-teal-500 to-cyan-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500 bg-clip-text text-transparent">
              AI宠物形象重建
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              通过先进的AI技术，为您心爱的宠物创建逼真的数字形象，
              让记忆以全新的方式延续
            </p>
          </div>

          {/* 步骤流程卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {steps.map((step, index) => (
              <Link
                key={step.number}
                href={step.href}
                className="group relative"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-primary-200 p-6 transition-all duration-300 transform hover:-translate-y-2 h-full">
                  {/* 步骤编号 */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                    {step.number}
                  </div>

                  {/* 图标 */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  {/* 标题和描述 */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* 箭头指示器 */}
                  <div className="mt-4 flex items-center text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">开始</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 连接线（除最后一个外） */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-300 to-gold-300"></div>
                )}
              </Link>
            ))}
          </div>

          {/* 快速开始按钮 */}
          <div className="text-center">
            <Link
              href="/pet-reconstruction/upload"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-primary-500 to-gold-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              <span>立即开始</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              预计完成时间：5-10分钟
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PetReconstructionPage() {
  return (
    <PetReconstructionProvider>
      <PetReconstructionContent />
    </PetReconstructionProvider>
  )
}
