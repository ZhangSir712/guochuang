'use client'

import Navbar from '../../components/Navbar'
import { useState } from 'react'
import { Heart, MessageSquare, Calendar, Image, Users, Share2 } from 'lucide-react'

const Healing = () => {
  const [message, setMessage] = useState('')
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      user: '用户A',
      content: '我的狗狗离开我已经一个月了，感谢宠智灵境让我能够再次与它互动，这对我来说意义重大。',
      likes: 24,
      time: '2小时前'
    },
    {
      id: 2,
      user: '用户B',
      content: '每次看到数字宠物的互动，都会想起我的猫咪，虽然它不在了，但感觉它一直陪在我身边。',
      likes: 18,
      time: '5小时前'
    },
    {
      id: 3,
      user: '用户C',
      content: '通过这个平台，我认识了很多有相同经历的朋友，我们互相支持，一起度过难过的日子。',
      likes: 36,
      time: '1天前'
    }
  ])

  const dailyAffirmations = [
    '你的宠物在天堂里过得很快乐，它会一直守护着你。',
    '悲伤是爱的证明，你对宠物的爱永远不会消失。',
    '每一个与宠物相处的美好回忆都是你生命中的宝贵财富。',
    '允许自己悲伤，但也要记得照顾好自己，你的宠物希望你幸福。',
    '时间会慢慢抚平伤痛，但对宠物的爱会永远留在心中。'
  ]

  const randomAffirmation = dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)]

  const handleSendPost = () => {
    if (message.trim()) {
      setCommunityPosts([
        {
          id: Date.now(),
          user: '我',
          content: message,
          likes: 0,
          time: '刚刚'
        },
        ...communityPosts
      ])
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primary-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">情感疗愈中心</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              在这里，我们提供心理支持和社区分享，帮助您度过失去宠物的难过时期
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：心理支持 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 每日慰藉语录 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">每日慰藉</h2>
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
                <div className="bg-primary-50 rounded-xl p-5">
                  <p className="text-gray-700 italic">&ldquo;{randomAffirmation}&rdquo;</p>
                </div>
              </div>

              {/* 数字纪念册 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">数字纪念册</h2>
                  <Image className="w-5 h-5 text-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-primary-400" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gold-400" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-primary-400" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <button className="mt-4 text-primary-500 font-medium hover:underline">查看全部照片</button>
              </div>
            </div>

            {/* 右侧：社区动态 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">社区动态</h2>
                  <Users className="w-5 h-5 text-primary-500" />
                </div>
                
                {/* 发布动态 */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="分享你对宠物的思念..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendPost()}
                    />
                    <button
                      onClick={handleSendPost}
                      className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* 动态列表 */}
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="p-4 border border-gray-100 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
                            <span className="text-white font-medium">{post.user.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{post.user}</h3>
                            <p className="text-sm text-gray-500">{post.time}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>评论</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Healing