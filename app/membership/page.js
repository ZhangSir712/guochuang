'use client'

import Navbar from '../../components/Navbar'
import { Check, X, ArrowRight, Heart } from 'lucide-react'

const Membership = () => {
  const plans = [
    {
      name: '基础版',
      price: '¥99/月',
      features: [
        '基本数字宠物交互',
        '有限的记忆上传',
        '基础对话功能',
        '数字纪念册',
        '社区访问权限'
      ],
      isPopular: false
    },
    {
      name: '高级版',
      price: '¥199/月',
      features: [
        '高级数字宠物交互',
        '无限记忆上传',
        '深度性格复刻',
        '主动关怀功能',
        '专属数字形象',
        '优先技术支持',
        '高级社区权限'
      ],
      isPopular: true
    }
  ]

  const faqs = [
    {
      question: '会员费用可以退款吗？',
      answer: '是的，我们提供7天无理由退款保证。如果您对服务不满意，可以在7天内申请全额退款。'
    },
    {
      question: '如何取消会员订阅？',
      answer: '您可以在账户设置中随时取消订阅，取消后服务将持续到当前计费周期结束。'
    },
    {
      question: '高级版的主动关怀功能是什么？',
      answer: '主动关怀功能会根据您的使用情况和情绪状态，由AI宠物主动发送关怀消息，提供情感支持。'
    },
    {
      question: '深度性格复刻需要多长时间？',
      answer: '通常需要1-3个工作日，我们会分析您上传的所有资料，创建一个更符合您宠物真实性格的数字形象。'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primary-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">AI数字永生会员</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              选择适合您的会员计划，获得更深度的数字宠物体验和情感支持
            </p>
          </div>

          {/* 会员计划 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-lg p-8 border ${plan.isPopular ? 'border-primary-500' : 'border-gray-200'}`}
              >
                {plan.isPopular && (
                  <div className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                    推荐
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold text-gray-900 mb-6">{plan.price}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.isPopular ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  选择此计划
                </button>
              </div>
            ))}
          </div>

          {/* 常见问题 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">常见问题</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Membership