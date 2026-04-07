'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import AnimatedPet from '../../../components/AnimatedPet'
import { openDesktopPet } from '../desktop/page'
import { PetReconstructionProvider, usePetReconstruction } from '../../../context/PetReconstructionContext'
import {
  Eye,
  ArrowLeft,
  ArrowRight,
  Download,
  RotateCcw,
  ZoomIn,
  Heart,
  Share2,
  Monitor,
  Play,
  Pause,
  Gauge,
  Sparkles
} from 'lucide-react'

function PreviewContent() {
  const { generatedImage, config, files } = usePetReconstruction()
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [petSize, setPetSize] = useState('medium')

  const handleOpenDesktop = () => {
    if (generatedImage) {
      openDesktopPet(generatedImage, { ...config, size: petSize })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-pink-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">步骤 4：预览效果</h1>
            <p className="text-gray-600">查看生成的宠物数字形象，体验动态效果，满意后启动桌面模式</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">宠物预览</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowAnimation(!showAnimation)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        showAnimation
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title={showAnimation ? '暂停动画' : '播放动画'}
                    >
                      {showAnimation ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>{showAnimation ? '暂停' : '播放'}</span>
                    </button>

                    <select
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={0.5}>0.5x 慢速</option>
                      <option value={1}>1x 正常</option>
                      <option value={1.5}>1.5x 快速</option>
                      <option value={2}>2x 极快</option>
                    </select>
                  </div>
                </div>

                <div className="aspect-square bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-200">
                  {generatedImage ? (
                    showAnimation ? (
                      <div className="flex items-center justify-center w-full h-full p-8">
                        <AnimatedPet
                          imageUrl={generatedImage}
                          config={{
                            enableBlink: true,
                            enableBreathe: true,
                            enableIdle: true,
                            speed: animationSpeed,
                            size: petSize,
                            showMessages: true,
                          }}
                        />
                      </div>
                    ) : (
                      <img
                        src={generatedImage}
                        alt="生成的宠物形象（静态）"
                        className="max-w-full max-h-full object-contain"
                      />
                    )
                  ) : (
                    <div className="text-center">
                      <Eye className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-400 font-medium mb-2">等待生成结果</p>
                      <p className="text-sm text-gray-400">
                        完成AI生成后，结果将在此处显示
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => {
                      if (generatedImage) {
                        const link = document.createElement('a')
                        link.href = generatedImage
                        link.download = 'my-animated-pet.png'
                        link.click()
                      }
                    }}
                    disabled={!generatedImage}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    <span>下载图片</span>
                  </button>

                  <Link
                    href="/pet-reconstruction/generate"
                    className="flex items-center space-x-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>重新生成</span>
                  </Link>

                  <button
                    onClick={handleOpenDesktop}
                    disabled={!generatedImage}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    <Monitor className="w-5 h-5" />
                    <span>启动桌面宠物</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-purple-500" />
                  动画控制面板
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      宠物尺寸
                    </label>
                    <select
                      value={petSize}
                      onChange={(e) => setPetSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="small">小 (200×250)</option>
                      <option value="medium">中 (300×375)</option>
                      <option value="large">大 (400×500)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-green-700">
                        眨眼动画
                      </label>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        3-8秒随机
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      ✓ 已启用 · 自然眨眼效果
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-blue-700">
                        呼吸动画
                      </label>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        5秒周期
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      ✓ 已启用 · 轻柔浮动效果
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 flex items-start">
                    <span className="mr-2">💡</span>
                    <span>
                      <strong>交互提示：</strong>点击宠物可以触发跳跃动画和气泡文字！
                      尝试调整上方的速度滑块来改变动画节奏。
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">生成信息</h3>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">使用风格</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {config.style || 'cartoon'}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">图像质量</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {config.quality || 'high'}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">背景设置</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {config.background || 'transparent'}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">源文件数量</p>
                    <p className="font-semibold text-gray-800">{files.length} 个文件</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  桌面宠物模式
                </h3>
                <p className="text-sm text-orange-700 mb-4 leading-relaxed">
                  将您的数字宠物放到桌面上！支持拖拽、点击互动、始终置顶等功能，
                  让宠物陪伴您工作的每一刻。
                </p>
                <button
                  onClick={handleOpenDesktop}
                  disabled={!generatedImage}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  <Monitor className="w-5 h-5" />
                  <span>立即启动桌面宠物</span>
                </button>
                {!generatedImage && (
                  <p className="text-xs text-orange-600 mt-2 text-center">
                    ⚠️ 请先生成宠物形象
                  </p>
                )}
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <p className="text-sm text-primary-700 leading-relaxed">
                  💡 <strong>下一步：</strong>对预览效果满意后，点击&ldquo;启动桌面宠物&rdquo;
                  按钮，打开独立的桌面窗口。宠物将始终显示在屏幕最上层，
                  您可以自由拖拽位置并与之互动！
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              href="/pet-reconstruction/generate"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>上一步：配置与生成</span>
            </Link>

            <Link
              href="/pet-reconstruction/desktop"
              className={`flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all shadow-md ${
                !generatedImage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => !generatedImage && e.preventDefault()}
            >
              <span>完成设置</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PreviewPage() {
  return <PreviewContent />
}
