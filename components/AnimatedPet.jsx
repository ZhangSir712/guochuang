'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'

const ANIMATION_CONFIG = {
  blink: {
    minInterval: 3000,
    maxInterval: 8000,
    duration: 200,
  },
  breathe: {
    period: 5000,
    amplitude: 8,
    scaleAmplitude: 0.02,
  },
  idle: {
    headTiltPeriod: 10000,
    bodySwayPeriod: 7000,
    headTiltRange: 2,
    bodySwayRange: 2,
    idleChance: 0.3,
  },
}

const PET_MESSAGES = ['喵~', '汪！', '呼噜~', '*蹭蹭*', '🐾', '❤️']

export default function AnimatedPet({ imageUrl, config = {} }) {
  const {
    enableBlink = true,
    enableBreathe = true,
    enableIdle = true,
    speed = 1,
    size = 'medium',
    showMessages = true,
    interactionState = 'idle',
    customMessage = null,
  } = config

  const [isBlinking, setIsBlinking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [displayMessage, setDisplayMessage] = useState(null)

  const containerRef = useRef(null)
  const blinkTimeoutRef = useRef(null)
  const messageTimeoutRef = useRef(null)
  const focusIntervalRef = useRef(null)

  const sizeMap = {
    small: { width: 200, height: 250 },
    medium: { width: 300, height: 375 },
    large: { width: 400, height: 500 },
  }

  const currentSize = sizeMap[size] || sizeMap.medium

  const randomInRange = useCallback((min, max) => {
    return Math.random() * (max - min) + min
  }, [])

  useEffect(() => {
    if (!enableBlink || isPaused) return

    const scheduleNextBlink = () => {
      const interval = randomInRange(
        ANIMATION_CONFIG.blink.minInterval / speed,
        ANIMATION_CONFIG.blink.maxInterval / speed
      )
      blinkTimeoutRef.current = window.setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), ANIMATION_CONFIG.blink.duration / speed)
        scheduleNextBlink()
      }, interval)
    }

    scheduleNextBlink()

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current)
      }
    }
  }, [enableBlink, isPaused, speed, randomInRange])

  useEffect(() => {
    if (!showMessages || isPaused) return

    const showMessage = () => {
      if (Math.random() < ANIMATION_CONFIG.idle.idleChance) {
        const message = PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)]
        setCurrentMessage(message)
        messageTimeoutRef.current = window.setTimeout(() => {
          setCurrentMessage(null)
        }, 2000)
      }
      const nextMessageTime = randomInRange(5000, 12000) / speed
      messageTimeoutRef.current = window.setTimeout(showMessage, nextMessageTime)
    }

    const initialDelay = randomInRange(3000, 8000) / speed
    messageTimeoutRef.current = window.setTimeout(showMessage, initialDelay)

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [showMessages, isPaused, speed, randomInRange])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true)
      } else {
        setIsPaused(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleClick = useCallback(() => {
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 600)

    if (showMessages && !customMessage) {
      const messages = ['喜欢你！', '开心~', '继续点我呀!', '嘿嘿', '🥰']
      const msg = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(msg)
      setTimeout(() => setCurrentMessage(null), 1500)
    }
  }, [showMessages, customMessage])

  useEffect(() => {
    if (customMessage) {
      setDisplayMessage(customMessage)
    } else {
      setDisplayMessage(null)
    }
  }, [customMessage])

  const breatheStyle = enableBreathe
    ? {
        animation: `breathe ${ANIMATION_CONFIG.breathe.period / speed}ms ease-in-out infinite`,
      }
    : {}

  const idleStyle = enableIdle
    ? {
        animation: `idleHeadTilt ${ANIMATION_CONFIG.idle.headTiltPeriod / speed}ms ease-in-out infinite, idleBodySway ${ANIMATION_CONFIG.idle.bodySwayPeriod / speed}ms ease-in-out infinite`,
      }
    : {}

  const clickStyle = clickAnimation
    ? {
        animation: `petJump 600ms ease-out`,
      }
    : {}

  const listeningStyle = interactionState === 'listening'
    ? {
        animation: `petListening 1.5s ease-in-out infinite`,
        filter: 'brightness(1.05) saturate(1.1)',
      }
    : {}

  const thinkingStyle = interactionState === 'thinking'
    ? {
        animation: `petThinking 2s ease-in-out infinite`,
      }
    : {}

  const speakingStyle = interactionState === 'speaking'
    ? {
        animation: `petSpeaking 0.3s ease-in-out infinite`,
      }
    : {}

  const combinedAnimationStyle = {
    ...breatheStyle,
    ...idleStyle,
    ...clickStyle,
    ...listeningStyle,
    ...thinkingStyle,
    ...speakingStyle,
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block cursor-pointer group"
      style={{ width: currentSize.width, height: currentSize.height }}
      onClick={handleClick}
    >
      <div
        className="pet-image-container w-full h-full relative"
        style={combinedAnimationStyle}
      >
        <img
          src={imageUrl}
          alt="宠物形象"
          className="w-full h-full object-contain drop-shadow-lg rounded-lg"
          style={{
            filter: isBlinking ? 'brightness(0.95)' : 'none',
            transition: 'filter 0.1s ease',
          }}
          draggable={false}
        />

        {isBlinking && (
          <div
            className="absolute inset-0 bg-black/5 rounded-lg pointer-events-none"
            style={{ animation: 'blink 200ms ease-out' }}
          />
        )}
      </div>

      {(currentMessage || displayMessage) && (
        <div
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-primary-200 animate-bounce whitespace-nowrap z-10`}
        >
          <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
            <MessageCircle className="w-4 h-4 text-primary-500" />
            <span>{displayMessage || currentMessage}</span>
          </div>
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white`}
          />
        </div>
      )}

      {interactionState === 'thinking' && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-100 px-3 py-1 rounded-full shadow-md border border-yellow-300 animate-pulse">
            <span className="text-lg">🤔</span>
          </div>
        </div>
      )}

      {interactionState === 'listening' && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full shadow-md border border-blue-300">
            <span className="w-1.5 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
          点击互动 ✨
        </div>
      </div>
    </div>
  )
}

export function usePetAnimation(config = {}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const updateSpeed = useCallback((speed) => {
    setAnimationSpeed(speed)
  }, [])

  return {
    isPlaying,
    animationSpeed,
    togglePlay,
    updateSpeed,
    config: {
      ...config,
      speed: animationSpeed,
    },
  }
}
