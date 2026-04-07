'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Image, Video, X, AlertCircle, CheckCircle } from 'lucide-react'
import {
  validateFile,
  validateFileCount,
  canProceed,
  formatFileSize,
  createFileObjectWithDataUrl
} from '../utils/fileValidation'

export default function FileUploader({ files = [], setFiles }) {
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  const imageCount = files?.filter(f => f.type === 'image').length || 0
  const videoCount = files?.filter(f => f.type === 'video').length || 0
  const isMaxReached = imageCount >= 10

  useEffect(() => {
    return () => {
      (files || []).forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl)
      })
    }
  }, [])

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const processFiles = async (newFiles) => {
    const newErrors = []
    const validFiles = []

    const countValidation = validateFileCount(files, newFiles)
    if (!countValidation.valid) {
      newErrors.push(countValidation.error)
    } else {
      for (const file of newFiles) {
        const validation = validateFile(file)
        if (validation.valid) {
          const fileObj = await createFileObjectWithDataUrl(file)
          validFiles.push(fileObj)
        } else {
          newErrors.push(validation.error)
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    }

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles])
    }
  }

  const removeFile = (fileId) => {
    const fileToRemove = files.find(f => f.id === fileId)
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl)
    }
    setFiles(files.filter(f => f.id !== fileId))
  }

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = Math.floor(video.duration)
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
      video.onerror = () => resolve('未知时长')
      video.src = file.previewUrl
    })
  }

  return (
    <div className="w-full">
      {errors.length > 0 && (
        <div className="mb-4 space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-fade-in"
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer relative ${
          isDragging
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : isMaxReached
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isMaxReached && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isMaxReached}
        />

        {isDragging ? (
          <>
            <Upload className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-bounce" />
            <p className="text-xl font-semibold text-primary-600 mb-2">
              释放以上传文件
            </p>
            <p className="text-sm text-primary-500">
              放开鼠标即可完成上传
            </p>
          </>
        ) : isMaxReached ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-green-600 mb-2">
              已达上限
            </p>
            <p className="text-sm text-gray-500">
              最多支持10张照片，请删除部分文件后继续上传
            </p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-primary-500 transition-colors" />
            <p className="text-xl font-semibold text-gray-700 mb-2">
              拖拽文件到此处，或点击选择文件
            </p>
            <p className="text-sm text-gray-500 mb-1">
              支持 JPG、PNG、WebP 图片或 MP4、WebM 视频
            </p>
            <p className="text-xs text-gray-400">
              图片最大 10MB，视频最大 50MB · 最多 10 张照片或 1 个视频
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              已上传文件 ({files.length}/10)
            </h3>
            <span className="text-sm text-gray-500">
              {imageCount} 张照片{videoCount > 0 && ` · ${videoCount} 个视频`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id)
                  }}
                  className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                  title="删除文件"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="aspect-square relative overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gold-500" />
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {file.formattedSize}
                    {file.type === 'video' && (
                      <VideoDuration file={file} getVideoDuration={getVideoDuration} />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {imageCount > 0 && imageCount < 3 && videoCount === 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">
                请至少再上传 {3 - imageCount} 张照片才能继续
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function VideoDuration({ file, getVideoDuration }) {
  const [duration, setDuration] = useState('加载中...')

  useEffect(() => {
    let mounted = true
    getVideoDuration(file).then(dur => {
      if (mounted) setDuration(dur)
    })
    return () => { mounted = false }
  }, [file, getVideoDuration])

  return <span className="ml-2">· {duration}</span>
}
