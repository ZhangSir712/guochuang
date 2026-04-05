'use client'

import Link from 'next/link'
import { Home, Heart, Flame, Users, Star, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: '首页', icon: <Home className="w-4 h-4" />, href: '/' },
    { name: '记忆录入', icon: <Heart className="w-4 h-4" />, href: '/onboarding' },
    { name: '数字告别', icon: <Flame className="w-4 h-4" />, href: '/farewell' },
    { name: '疗愈中心', icon: <Users className="w-4 h-4" />, href: '/healing' },
    { name: '会员中心', icon: <Star className="w-4 h-4" />, href: '/membership' },
  ]

  const mobileNavItems = [
    { name: '首页', icon: <Home className="w-5 h-5" />, href: '/' },
    { name: '记忆录入', icon: <Heart className="w-5 h-5" />, href: '/onboarding' },
    { name: '数字告别', icon: <Flame className="w-5 h-5" />, href: '/farewell' },
    { name: '疗愈中心', icon: <Users className="w-5 h-5" />, href: '/healing' },
    { name: '会员中心', icon: <Star className="w-5 h-5" />, href: '/membership' },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
              宠智灵境
            </span>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 fade-in">
            <div className="flex flex-col space-y-4">
              {mobileNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar