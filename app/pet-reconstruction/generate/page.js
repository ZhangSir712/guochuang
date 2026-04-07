'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { usePetReconstruction } from '../../../context/PetReconstructionContext'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Palette,
  Star,
  Layers,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Image as ImageIcon,
  Zap
} from 'lucide-react'
import { buildPrompt } from '../../../api/imageGeneration'

const generationStates = {
  IDLE: 'idle',
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

const styles = [
  { value: 'cute', label: 'Q版萌系', emoji: '🎀', desc: '大眼睛小身体，可爱夸张' },
  { value: 'realistic', label: '写实卡通', emoji: '🎨', desc: '保留真实比例，简化细节' },
  { value: 'watercolor', label: '水彩风', emoji: '💧', desc: '水彩笔触，艺术感强' },
  { value: 'pixel', label: '像素风', emoji: '👾', desc: '复古像素风格' }
]

const qualities = [
  { value: 'standard', label: '标准质量', desc: '快速生成', icon: '⚡' },
  { value: 'high', label: '高质量', desc: '细节丰富', icon: '✨' },
  { value: 'ultra', label: '超高质量', desc: '最佳效果', icon: '💎' }
]

const backgrounds = [
  { value: 'transparent', label: '透明' },
  { value: 'white', label: '纯白色' },
  { value: 'gradient', label: '渐变背景' }
]

const VOLCENGINE_ENDPOINT = 'https://ark.cn-beijing.volces.com/api/v3/images/generations'
const VOLCENGINE_MODEL = 'doubao-seedream-5-0-260128'
const VOLCENGINE_API_KEY = '52cec150-f740-4f00-b062-997781e6c681'

export default function GeneratePage() {
  const { config, setConfig, files, setGeneratedImage } = usePetReconstruction()
  
  const [generationState, setGenerationState] = useState(generationStates.IDLE)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [generationTime, setGenerationTime] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [apiDebugInfo, setApiDebugInfo] = useState(null)

  const getProgressMessage = () => {
    switch (Math.floor(progress / 25)) {
      case 0: return '准备API请求...'
      case 1: return '正在发送图片到火山引擎...'
      case 2: return 'AI正在处理中...'
      case 3: return '即将完成...'
      default: return '处理完成!'
    }
  }

  const callVolcengineAPI = async () => {
    if (!files || files.length === 0) {
      throw new Error('请先上传至少1张图片')
    }

    setApiDebugInfo('正在构造API请求...')

    const prompt = buildPrompt(config)

    const requestBody = {
      model: VOLCENGINE_MODEL,
      prompt: prompt,
      response_format: 'url',
      size: '2K',
      stream: false,
      watermark: true
    }

    setApiDebugInfo(`请求体: ${JSON.stringify(requestBody, null, 2)}`)

    try {
      const response = await fetch(VOLCENGINE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOLCENGINE_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      })

      setApiDebugInfo(`响应状态: ${response.status}`)

      const responseText = await response.text()
      setApiDebugInfo(`响应内容: ${responseText}`)

      if (!response.ok) {
        let errorMsg = `API请求失败 (HTTP ${response.status})`
        try {
          const errData = JSON.parse(responseText)
          if (errData.error?.message) {
            errorMsg = errData.error.message
          }
        } catch (e) {}
        throw new Error(errorMsg)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        throw new Error('API返回格式无效')
      }

      let imageUrl = null
      if (data.data?.[0]?.url) {
        imageUrl = data.data[0].url
      } else if (data.url) {
        imageUrl = data.url
      } else if (data.image_url) {
        imageUrl = data.image_url
      }

      if (!imageUrl) {
        throw new Error('API返回中未找到图片URL')
      }

      return { url: imageUrl }

    } catch (fetchErr) {
      console.error('火山引擎API调用失败:', fetchErr)
      setApiDebugInfo(`错误详情: ${fetchErr.message}`)
      throw fetchErr
    }
  }

  const startGeneration = useCallback(async () => {
    const startTime = Date.now()
    
    setGenerationState(generationStates.PROCESSING)
    setProgress(10)
    setError(null)
    setResultUrl(null)
    setGenerationTime(null)
    setApiDebugInfo(null)

    try {
      if (files.length === 0) {
        throw new Error('请先上传宠物图片')
      }

      setProgress(20)
      setApiDebugInfo('开始调用火山引擎API...')

      const result = await callVolcengineAPI()

      setResultUrl(result.url)
      const endTime = Date.now()
      setGenerationTime(((endTime - startTime) / 1000).toFixed(1))
      setGenerationState(generationStates.COMPLETED)
      setRetryCount(0)

    } catch (err) {
      console.error('Generation failed:', err)
      setGenerationState(generationStates.FAILED)
      setError(err.message || '生成失败，请重试')
    }
  }, [config, files, setGeneratedImage])

  const handleRetry = useCallback(async () => {
    if (retryCount >= 3) {
      setError('多次尝试仍未成功，请检查网络或联系客服')
      return
    }
    
    setRetryCount(prev => prev + 1)
    await startGeneration()
  }, [retryCount, startGeneration])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-primary-50 to-gold-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">步骤 3：配置参数与AI生成</h1>
            <p className="text-gray-600">使用火山引擎AI生成您的数字宠物形象</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-800">API配置</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="font-semibold text-purple-700">端点:</p>
                    <p className="text-purple-600 font-mono text-xs break-all">{VOLCENGINE_ENDPOINT}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="font-semibold text-purple-700">模型:</p>
                    <p className="text-purple-600 font-mono">{VOLCENGINE_MODEL}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="font-semibold text-purple-700">API密钥:</p>
                    <p className="text-purple-600">已配置</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-5 h-5 text-pink-500" />
                  <h3 className="text-lg font-bold text-gray-800">风格选择</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setConfig({ style: style.value })}
                      disabled={generationState === generationStates.PROCESSING}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                        config.style === style.value
                          ? 'border-pink-500 bg-pink-50 shadow-md scale-105'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{style.emoji}</span>
                      <p className="font-semibold text-sm">{style.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-gold-500" />
                    <h3 className="text-lg font-bold text-gray-800">图像质量</h3>
                  </div>
                  <div className="space-y-2">
                    {qualities.map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => setConfig({ quality: quality.value })}
                        disabled={generationState === generationStates.PROCESSING}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                          config.quality === quality.value
                            ? 'border-gold-500 bg-gold-50 shadow-md'
                            : 'border-gray-200 hover:border-gold-300 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-semibold text-gray-800">{quality.icon} {quality.label}</p>
                        <p className="text-sm text-gray-600">{quality.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Layers className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-800">背景设置</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.value}
                        onClick={() => setConfig({ background: bg.value })}
                        disabled={generationState === generationStates.PROCESSING}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                          config.background === bg.value
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-semibold text-gray-800">{bg.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                {files.length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-green-800 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        已上传 {files.length} 个文件
                      </h4>
                      <Link href="/pet-reconstruction/upload" className="text-sm text-primary-600 hover:text-primary-800">
                        管理文件 →
                      </Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {files.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              📷
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generationState === generationStates.IDLE && (
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg text-gray-700 mb-6">
                      配置完成后点击下方按钮，使用火山引擎AI生成
                    </p>
                    <button
                      onClick={startGeneration}
                      disabled={files.length === 0}
                      className={`px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 ${
                        files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Zap className="w-6 h-6" />
                        <span>开始火山引擎AI生成</span>
                      </span>
                    </button>
                    {files.length === 0 && (
                      <p className="mt-4 text-red-500 text-sm">⚠️ 请先上传宠物图片</p>
                    )}
                  </div>
                )}

                {(generationState === generationStates.PROCESSING || generationState === generationStates.QUEUED) && (
                  <div className="text-center py-8">
                    <Loader2 className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">正在调用火山引擎...</h3>
                    <p className="text-gray-600 mb-6">{getProgressMessage()}</p>
                    
                    <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{Math.round(progress)}%</p>
                    
                    {apiDebugInfo && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left">
                        <p className="text-xs font-mono text-gray-700 break-all">{apiDebugInfo}</p>
                      </div>
                    )}
                  </div>
                )}

                {generationState === generationStates.COMPLETED && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">生成完成！</h3>
                    <p className="text-gray-600 mb-2">
                      使用方式：<span className="font-semibold text-purple-600">火山引擎 ({VOLCENGINE_MODEL})</span>
                    </p>
                    {generationTime && <p className="text-sm text-gray-500">耗时: {generationTime}秒</p>}
                  </div>
                )}

                {generationState === generationStates.FAILED && (
                  <div className="text-center py-8">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-600 mb-4">生成失败</h3>
                    <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg inline-block mb-6">
                      {error}
                    </p>
                    
                    {apiDebugInfo && (
                      <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                        <p className="text-xs font-semibold text-gray-700 mb-2">调试信息：</p>
                        <p className="text-xs font-mono text-gray-600 break-all">{apiDebugInfo}</p>
                      </div>
                    )}
                    
                    {retryCount < 3 && (
                      <button
                        onClick={handleRetry}
                        className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>重新生成 ({3 - retryCount}次机会)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {resultUrl && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    生成结果
                  </h3>
                  <img src={resultUrl} alt="生成的宠物" className="w-full rounded-xl shadow-md mb-4" />
                  
                  <div className="space-y-2">
                    <a
                      href={resultUrl}
                      download="my-pet.png"
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <span>💾 下载图片</span>
                    </a>
                    <Link
                      href="/pet-reconstruction/preview"
                      state={{ imageUrl: resultUrl }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
                    >
                      <span>👁 预览动画效果</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-purple-700 leading-relaxed">
                  <strong>💡 提示：</strong>
                  本页面仅使用火山引擎API进行图像生成。如果API调用失败，请检查网络连接或查看上方调试信息。
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              href="/pet-reconstruction/upload"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>上一步：上传媒体</span>
            </Link>

            {resultUrl && (
              <Link
                href="/pet-reconstruction/preview"
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all shadow-md"
              >
                <span>下一步：预览效果</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
