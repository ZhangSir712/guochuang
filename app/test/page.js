'use client'

import Navbar from '../../components/Navbar'

const Test = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center">测试页面</h1>
        <p className="text-center mt-4">如果看到这个页面，说明基本的组件渲染是正常的</p>
      </main>
    </div>
  )
}

export default Test