'use client'

import Navbar from '../../components/Navbar'
import { useState } from 'react'
import { Camera, Video, Mic, Upload, Heart } from 'lucide-react'

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    personality: '',
    habits: ''
  })
  const [activeStep, setActiveStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (type) => {
    // 模拟文件上传
    const mockFile = {
      id: Date.now(),
      name: `sample-${type}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3'}`,
      type: type
    }
    setUploadedFiles(prev => [...prev, mockFile])
  }

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primary-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">创建数字宠物记忆</h1>
            <p className="text-gray-600">请填写以下信息，帮助我们构建您宠物的数字生命</p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step}
                </div>
                <span className={`text-sm mt-2 ${activeStep >= step ? 'text-primary-500' : 'text-gray-400'}`}>
                  {step === 1 && '基本信息'}
                  {step === 2 && '性格习惯'}
                  {step === 3 && '记忆上传'}
                </span>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${activeStep > step ? 'bg-primary-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* 表单内容 */}
          <div className="space-y-6">
            {/* 步骤 1：基本信息 */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">宠物姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入宠物的名字"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">宠物品种</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入宠物的品种"
                  />
                </div>
              </div>
            )}

            {/* 步骤 2：性格习惯 */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">性格关键词</label>
                  <input
                    type="text"
                    name="personality"
                    value={formData.personality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="例如：粘人、调皮、温顺"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生前习惯</label>
                  <textarea
                    name="habits"
                    value={formData.habits}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请描述宠物的日常习惯和喜好"
                  />
                </div>
              </div>
            )}

            {/* 步骤 3：记忆上传 */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <p className="text-gray-600">上传宠物的照片、视频和音频，帮助我们构建完整的生命记忆图谱</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer" onClick={() => handleFileUpload('image')}>
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">上传照片</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer" onClick={() => handleFileUpload('video')}>
                    <Video className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">上传视频</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer" onClick={() => handleFileUpload('audio')}>
                    <Mic className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">上传音频</p>
                  </div>
                </div>

                {/* 已上传文件 */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">已上传文件</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {file.type === 'image' && <Camera className="w-5 h-5 text-primary-500" />}
                            {file.type === 'video' && <Video className="w-5 h-5 text-primary-500" />}
                            {file.type === 'audio' && <Mic className="w-5 h-5 text-primary-500" />}
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={activeStep === 1}
                className={`px-6 py-3 rounded-lg ${activeStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'}`}
              >
                上一步
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {activeStep === 3 ? '完成' : '下一步'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Onboarding