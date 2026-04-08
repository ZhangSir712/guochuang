'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import AnimatedPet from '../../../components/AnimatedPet'
import PetVoiceInteraction from '../../../components/PetVoiceInteraction'
import {
  X,
  Minus,
  Settings,
  Maximize2,
  Minimize2,
  GripVertical,
  Info,
  Zap,
  MessageCircle,
  Keyboard,
} from 'lucide-react'

export function openDesktopPet(imageUrl, config = {}) {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams({
    image: imageUrl,
    petConfig: JSON.stringify(config),
    mode: 'desktop',
  })

  const sizeMap = {
    small: { width: 220, height: 280 },
    medium: { width: 320, height: 400 },
    large: { width: 420, height: 530 },
  }

  const size = sizeMap[config.size] || sizeMap.medium

  const features =
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes'

  const newWindow = window.open(
    `/pet-reconstruction/desktop?${params.toString()}`,
    'PetDesktop',
    `width=${size.width},height=${size.height},left=100,top=100,${features}`
  )

  if (newWindow) {
    newWindow.focus()
  }

  return newWindow
}

function DesktopPetContent() {
  const [imageUrl, setImageUrl] = useState(null)
  const [petConfig, setPetConfig] = useState({})
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showToolbar, setShowToolbar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentSize, setCurrentSize] = useState('medium')
  const [showVoiceInteraction, setShowVoiceInteraction] = useState(false)
  const [interactionState, setInteractionState] = useState('idle')
  const [customMessage, setCustomMessage] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const image = params.get('image')
    const configStr = params.get('petConfig')

    if (image) setImageUrl(image)
    if (configStr) {
      try {
        setPetConfig(JSON.parse(configStr))
        const parsed = JSON.parse(configStr)
        if (parsed.size) setCurrentSize(parsed.size)
      } catch (e) {
        console.error('Failed to parse config:', e)
      }
    }

    document.title = '🐾 宠智灵境 - 桌面宠物'

    const keepFocus = setInterval(() => {
      try {
        window.focus()
      } catch (e) {}
    }, 5000)

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setShowVoiceInteraction(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(keepFocus)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))

      setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest('.toolbar') || e.target.closest('.settings-panel') || e.target.closest('.voice-panel')) return

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setShowToolbar(true)
    },
    []
  )

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setShowSettings(true)
  }, [])

  const handleClose = useCallback(() => {
    if (typeof window !== undefined && window.close) {
      window.close()
    }
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  const sizeOptions = [
    { value: 'small', label: '小', icon: Minimize2 },
    { value: 'medium', label: '中', icon: Maximize2 },
    { value: 'large', label: '大', icon: Maximize2 },
  ]

  const sizeDimensions = {
    small: { width: 220, height: 280 },
    medium: { width: 320, height: 400 },
    large: { width: 420, height: 530 },
  }

  const handleResize = useCallback(
    ( newSize ) => {
      setCurrentSize(newSize)
      setPetConfig((prev) => ({ ...prev, size: newSize }))
    },
    []
  )

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-lg">加载中...</p>
        </div>
      </div>
    )
  }

  const dimensions = sizeDimensions[currentSize] || sizeDimensions.medium

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: dimensions.width,
        height: isMinimized ? 60 : dimensions.height,
        background: 'transparent',
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      ref={containerRef}
    >
      {!isMinimized && (
        <>
          <div
            className="flex items-center justify-center p-4 cursor-move select-none"
            style={{ minHeight: dimensions.height - 60 }}
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
          >
            <AnimatedPet
              imageUrl={imageUrl}
              config={{
                ...petConfig,
                size: currentSize,
                interactionState,
                customMessage,
              }}
            />
          </div>

          {showToolbar && (
            <div
              className={`toolbar absolute top-2 right-2 flex items-center space-x-1 bg-black/70 backdrop-blur-md rounded-lg p-1.5 shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-200 z-20`}
              onMouseEnter={() => setShowToolbar(true)}
              onMouseLeave={() => setShowToolbar(false)}
            >
              <GripVertical className="w-4 h-4 text-gray-400 mr-1" />

              {sizeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleResize(option.value)}
                    className={`p-1.5 rounded transition-colors ${
                      currentSize === option.value
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                    title={`${option.label}尺寸`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                )
              })}

              <button
                onClick={handleMinimize}
                className="p-1.5 rounded text-gray-300 hover:bg-yellow-500/80 hover:text-white transition-colors"
                title="最小化"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowVoiceInteraction(!showVoiceInteraction)}
                className={`p-1.5 rounded transition-colors ${
                  showVoiceInteraction
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-purple-500/80 hover:text-white'
                }`}
                title="语音交互 (Ctrl+Shift+P)"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded transition-colors ${
                  showSettings
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                title="设置"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded text-gray-300 hover:bg-red-500/80 hover:text-white transition-colors"
                title="关闭"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {showVoiceInteraction && (
            <div
              className={`voice-panel absolute top-12 right-2 w-80 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 z-30 border border-purple-200 max-h-96 overflow-y-auto`}
              onMouseEnter={() => setShowVoiceInteraction(true)}
              onMouseLeave={() => setShowVoiceInteraction(false)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
                  语音交互
                </h3>
                <button
                  onClick={() => setShowVoiceInteraction(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <PetVoiceInteraction
                onStateChange={setInteractionState}
                onMessage={setCustomMessage}
              />
            </div>
          )}

          {showSettings && (
            <div
              className={`settings-panel absolute top-12 right-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 z-30 border border-gray-200`}
              onMouseEnter={() => setShowSettings(true)}
              onMouseLeave={() => setShowSettings(false)}
            >
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-primary-500" />
                宠物设置
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    显示尺寸
                  </label>
                  <select
                    value={currentSize}
                    onChange={(e) => handleResize(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    {sizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({dimensions.width}×{dimensions.height})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
                    <div>
                      <p className="font-medium mb-1">关于</p>
                      <p>宠智灵境 v1.0</p>
                      <p>AI驱动的数字宠物伴侣</p>
                      <p className="mt-1 text-primary-600">
                        <Zap className="w-3 h-3 inline mr-1" />
                        拖拽移动 · 点击互动
                      </p>
                      <p className="mt-1 text-purple-600">
                        <Keyboard className="w-3 h-3 inline mr-1" />
                        Ctrl+Shift+P 语音交互
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isMinimized && (
        <div
          className={`h-full flex items-center justify-between px-4 bg-gradient-to-r from-primary-500 to-gold-500 cursor-pointer rounded-lg shadow-lg`}
          onClick={handleMinimize}
        >
          <div className="flex items-center space-x-2 text-white">
            <span className="text-xl">🐾</span>
            <span className="font-semibold text-sm">宠智灵境</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DesktopPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <DesktopPetContent />
    </div>
  )
}
