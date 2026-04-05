'use client'

import Navbar from '../../components/Navbar'

const TestNavbar = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center">测试Navbar页面</h1>
        <p className="text-center mt-4">如果看到这个页面，说明Navbar组件渲染正常</p>
      </main>
    </div>
  )
}

export default TestNavbar