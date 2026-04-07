const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp']
const ALLOWED_VIDEO_TYPES = ['mp4', 'webm']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024
const MIN_IMAGES = 3
const MAX_IMAGES = 10
const MAX_VIDEOS = 1

export function validateFile(file) {
  const extension = file.name.split('.').pop().toLowerCase()
  const isImage = file.type.startsWith('image')
  const isVideo = file.type.startsWith('video')

  if (!ALLOWED_IMAGE_TYPES.includes(extension) && !ALLOWED_VIDEO_TYPES.includes(extension)) {
    return {
      valid: false,
      error: `❌ ${file.name} 格式不支持。请上传 JPG/PNG/WebP 图片或 MP4/WebM 视频`
    }
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `❌ ${file.name} 文件过大（图片最大 10MB）`
    }
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `❌ ${file.name} 文件过大（视频最大 50MB）`
    }
  }

  return { valid: true, error: null }
}

export function validateFileCount(currentFiles, newFiles) {
  const currentImages = currentFiles.filter(f => f.type === 'image').length
  const currentVideos = currentFiles.filter(f => f.type === 'video').length

  const newImages = newFiles.filter(f => f.type.startsWith('image')).length
  const newVideos = newFiles.filter(f => f.type.startsWith('video')).length

  const totalImages = currentImages + newImages
  const totalVideos = currentVideos + newVideos

  if (totalImages > MAX_IMAGES) {
    return {
      valid: false,
      error: '⚠️ 最多支持上传10张照片'
    }
  }

  if (totalVideos > MAX_VIDEOS) {
    return {
      valid: false,
      error: '⚠️ 最多支持上传1个视频'
    }
  }

  return { valid: true, error: null }
}

export function canProceed(files) {
  const imageCount = files.filter(f => f.type === 'image').length
  const videoCount = files.filter(f => f.type === 'video').length

  return imageCount >= MIN_IMAGES || videoCount === 1
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export function getFileType(file) {
  if (file.type.startsWith('image')) return 'image'
  if (file.type.startsWith('video')) return 'video'
  return null
}

export function createFileObject(file) {
  const previewUrl = URL.createObjectURL(file)
  return {
    id: `${Date.now()}-${Math.random()}`,
    file,
    previewUrl,
    name: file.name,
    size: file.size,
    type: getFileType(file),
    formattedSize: formatFileSize(file.size),
    dataUrl: null
  }
}

export function createFileObjectWithDataUrl(file) {
  return new Promise((resolve) => {
    const previewUrl = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: getFileType(file),
        formattedSize: formatFileSize(file.size),
        dataUrl: e.target.result
      })
    }
    reader.onerror = () => {
      resolve({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: getFileType(file),
        formattedSize: formatFileSize(file.size),
        dataUrl: null
      })
    }
    reader.readAsDataURL(file)
  })
}
