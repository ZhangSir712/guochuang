'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import {
  Heart,
  Flame,
  Users,
  Star,
  PawPrint,
  ArrowRight,
  Quote,
  CheckCircle2
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: '记忆录入',
      description: '录入宠物的生命故事、性格特征和珍贵照片，AI将为您生成栩栩如生的2D动态数字伴侣',
      href: '/onboarding',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: '数字告别',
      description: '通过仪式化的数字告别方式，帮助用户完成情感closure和缅怀',
      href: '/farewell',
      color: 'from-gold-500 to-gold-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '疗愈中心',
      description: '提供每日慰藉语录、社区支持和数字纪念册，陪伴度过悲伤期',
      href: '/healing',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '会员中心',
      description: '享受高级功能和专属服务，获得更完整的数字宠物体验',
      href: '/membership',
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: '小明',
      petName: '狗狗豆豆',
      content: '通过宠智灵境，我感觉我的狗狗从未真正离开。每次与它互动，都能感受到那份熟悉的温暖。',
      avatar: '🐕'
    },
    {
      name: '小红',
      petName: '猫咪咪咪',
      content: '数字告别仪式让我终于可以说出那句再见。感谢这个平台，让我有了一个正式告别的机会。',
      avatar: '🐱'
    },
    {
      name: '小华',
      petName: '兔子跳跳',
      content: '疗愈中心的每日语录陪伴我度过了最难熬的日子。这里不仅是一个平台，更像是一个温暖的大家庭。',
      avatar: '🐰'
    }
  ]

  const stats = [
    { icon: <PawPrint className="w-10 h-10" />, value: '10,000+', label: '已创建数字宠物', color: 'text-primary-500' },
    { icon: <Users className="w-10 h-10" />, value: '50,000+', label: '服务用户数', color: 'text-gold-500' },
    { icon: <Heart className="w-10 h-10" />, value: '100,000+', label: '情感支持次数', color: 'text-pink-500' },
    { icon: <Star className="w-10 h-10" />, value: '98%', label: '用户满意度', color: 'text-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero Banner 区域 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-gold-50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500 bg-clip-text text-transparent leading-tight">
              宠智灵境
            </h1>

            <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              让爱以数字形式永存
            </p>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              通过AI技术为失去宠物的用户提供数字生命复刻与情感慰藉，
              让每一份爱都能以数字形式永远保存
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/onboarding"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>开始创建数字宠物</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                className="px-8 py-4 border-2 border-primary-300 text-primary-600 text-lg font-semibold rounded-full hover:bg-primary-50 transition-all duration-300"
              >
                了解更多
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 核心功能特性展示区 */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              核心功能
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供全方位的数字宠物服务，让爱与记忆得以延续
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center text-primary-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span>了解更多</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 用户故事/见证区域 */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              用户故事
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              听听他们如何通过宠智灵境找到心灵的慰藉
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary-100" />

                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center text-4xl mb-4 shadow-md">
                    {testimonial.avatar}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.petName}的主人</p>
                </div>

                <p className="text-gray-600 leading-relaxed italic text-center">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据统计展示区 */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              数据见证成长
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              每一个数字背后，都是一份被珍视的爱与回忆
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className={`inline-flex items-center justify-center ${stat.color} mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-base md:text-lg text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 行动召唤区域 */}
      <section className="py-20 bg-gradient-to-br from-gold-50 via-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-white rounded-3xl shadow-2xl p-12 md:p-16 border border-gray-100">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              准备好让爱延续了吗？
            </h2>

            <p className="text-xl text-gray-600 mb-10">
              只需三步，即可为您心爱的宠物创建数字生命
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <span className="text-lg text-gray-700">录入宠物信息</span>
              </div>

              <CheckCircle2 className="w-6 h-6 text-gold-500 hidden md:block" />

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-lg text-gray-700">AI生成数字生命</span>
              </div>

              <CheckCircle2 className="w-6 h-6 text-gold-500 hidden md:block" />

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-lg text-gray-700">开始互动疗愈</span>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="inline-block px-12 py-5 bg-gradient-to-r from-primary-500 to-gold-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              立即开始
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">宠智灵境</span>
          </div>
          <p className="text-gray-400 mb-4">
            让每一份爱都以数字形式永存
          </p>
          <p className="text-sm text-gray-500">
            © 2024 宠智灵境 Pet Intelligence Realm. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
