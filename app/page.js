'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">宠</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                宠智灵境
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-500 transition-colors">首页</a>
              <a href="/onboarding" className="text-gray-600 hover:text-blue-500 transition-colors">记忆录入</a>
              <a href="/farewell" className="text-gray-600 hover:text-blue-500 transition-colors">数字告别</a>
              <a href="/healing" className="text-gray-600 hover:text-blue-500 transition-colors">疗愈中心</a>
              <a href="/membership" className="text-gray-600 hover:text-blue-500 transition-colors">会员中心</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center">宠智灵境 - AI驱动的数字宠物与情感疗愈平台</h1>
        <p className="text-center mt-4">欢迎来到宠智灵境，通过AI技术为失去宠物的用户提供数字生命复刻与情感慰藉</p>
      </main>
    </div>
  )
}