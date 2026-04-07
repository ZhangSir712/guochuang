'use client'

import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { usePetReconstruction } from '../../../context/PetReconstructionContext'
import FileUploader from '../../../components/FileUploader'
import { Upload, ArrowLeft, ArrowRight } from 'lucide-react'
import { canProceed } from '../../../utils/fileValidation'

function UploadContent() {
  const { files, setFiles, setCurrentStep } = usePetReconstruction()
  const isCanProceed = canProceed(files)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primary-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">步骤 1：上传媒体文件</h1>
            <p className="text-gray-600">
              上传您宠物的照片或视频，AI将基于这些素材生成数字形象
            </p>
          </div>

          {/* 上传区域 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <FileUploader files={files} setFiles={setFiles} />
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between items-center mt-6">
            <Link
              href="/pet-reconstruction"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回主页</span>
            </Link>

            <button
              onClick={() => {
                setCurrentStep(2)
                window.location.href = '/pet-reconstruction/generate'
              }}
              disabled={!isCanProceed}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-all shadow-md ${
                isCanProceed
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={
                !isCanProceed
                  ? '请至少上传 3 张照片或 1 个视频'
                  : '继续下一步'
              }
            >
              <span>下一步：配置参数</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function UploadPage() {
  return <UploadContent />
}
