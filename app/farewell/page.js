'use client'

import Navbar from '../../components/Navbar'
import { useState } from 'react'
import { Sparkles, MessageSquare, Flame, Camera, Heart } from 'lucide-react'

const Farewell = () => {
  const [flowers, setFlowers] = useState(0)
  const [candles, setCandles] = useState(0)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showQR, setShowQR] = useState(false)

  const handleAddFlower = () => {
    setFlowers(prev => prev + 1)
  }

  const handleAddCandle = () => {
    setCandles(prev => prev + 1)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message }])
      setMessage('')
    }
  }

  const handleGeneratePreview = () => {
    setShowQR(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">数字告别仪式</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              在这里，我们为您的宠物举行一个庄重的数字告别仪式，让我们一起缅怀与它共度的美好时光
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：仪式区域 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-center">缅怀仪式</h2>
              
              {/* 中央区域 */}
              <div className="relative h-80 bg-gray-900/50 rounded-xl mb-6 flex items-center justify-center">
                {/* 宠物纪念照片 */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white/80" />
                </div>
                
                {/* 蜡烛效果 */}
                {candles > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-yellow-500/10 rounded-xl animate-pulse-slow"></div>
                  </div>
                )}
              </div>
              
              {/* 互动按钮 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button 
                  onClick={handleAddFlower}
                  className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Sparkles className="w-8 h-8 text-gold-400 mb-2" />
                  <span className="text-sm">献花 ({flowers})</span>
                </button>
                <button 
                  onClick={handleAddCandle}
                  className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Flame className="w-8 h-8 text-yellow-400 mb-2" />
                  <span className="text-sm">点蜡烛 ({candles})</span>
                </button>
                <button 
                  onClick={handleGeneratePreview}
                  className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Camera className="w-8 h-8 text-primary-400 mb-2" />
                  <span className="text-sm">生成预览</span>
                </button>
              </div>
              
              {/* 寄语区域 */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">留下您的寄语</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="输入您想对宠物说的话..."
                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 右侧：寄语墙和生成预览 */}
            <div className="space-y-6">
              {/* 寄语墙 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">寄语墙</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center italic">还没有寄语，留下您的思念吧</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-200">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* 即时生成预览 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">数字形象生成</h2>
                {showQR ? (
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="w-40 h-40 bg-gray-200 rounded"></div>
                    </div>
                    <p className="text-gray-300 mb-4">扫描二维码，快速生成您宠物的数字形象</p>
                    <button 
                      onClick={() => setShowQR(false)}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      关闭预览
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-300 mb-4">点击左侧的"生成预览"按钮，开始创建您宠物的数字形象</p>
                    <div className="w-48 h-48 bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Farewell