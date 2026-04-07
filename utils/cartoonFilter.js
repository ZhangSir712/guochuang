const stylePresets = {
  cute: {
    blur: 3,
    posterizeLevels: 6,
    edgeStrength: 1.5,
    saturation: 1.3,
    brightness: 1.05,
    contrast: 1.1
  },
  realistic: {
    blur: 1,
    posterizeLevels: 12,
    edgeStrength: 0.8,
    saturation: 1.1,
    brightness: 1.0,
    contrast: 1.05
  },
  watercolor: {
    blur: 4,
    posterizeLevels: 10,
    edgeStrength: 0.6,
    saturation: 0.9,
    brightness: 1.1,
    contrast: 0.95
  },
  pixel: {
    blur: 0,
    posterizeLevels: 4,
    edgeStrength: 2.0,
    saturation: 1.4,
    brightness: 1.0,
    contrast: 1.2
  }
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    if (source instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('图片加载失败'))
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsDataURL(source)
    } else if (source instanceof HTMLImageElement) {
      resolve(source)
    } else if (typeof source === 'string') {
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片URL加载失败'))
      img.src = source
    } else {
      reject(new Error('不支持的图片源类型'))
    }
  })
}

function applyGaussianBlur(imageData, width, height, radius) {
  if (radius <= 0) return imageData

  const data = imageData.data
  const output = new Uint8ClampedArray(data.length)
  const kernelSize = radius * 2 + 1
  const kernel = []
  let sum = 0

  for (let i = 0; i < kernelSize; i++) {
    const value = Math.exp(-((i - radius) * (i - radius)) / (2 * radius * radius))
    kernel.push(value)
    sum += value
  }

  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum
  }

  const temp = new Uint8ClampedArray(data.length)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0

      for (let k = -radius; k <= radius; k++) {
        const px = Math.min(Math.max(x + k, 0), width - 1)
        const idx = (y * width + px) * 4
        r += data[idx] * kernel[k + radius]
        g += data[idx + 1] * kernel[k + radius]
        b += data[idx + 2] * kernel[k + radius]
        a += data[idx + 3] * kernel[k + radius]
      }

      const idx = (y * width + x) * 4
      temp[idx] = r
      temp[idx + 1] = g
      temp[idx + 2] = b
      temp[idx + 3] = a
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0

      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(Math.max(y + k, 0), height - 1)
        const idx = (py * width + x) * 4
        r += temp[idx] * kernel[k + radius]
        g += temp[idx + 1] * kernel[k + radius]
        b += temp[idx + 2] * kernel[k + radius]
        a += temp[idx + 3] * kernel[k + radius]
      }

      const idx = (y * width + x) * 4
      output[idx] = r
      output[idx + 1] = g
      output[idx + 2] = b
      output[idx + 3] = a
    }
  }

  return new ImageData(output, width, height)
}

function detectEdges(imageData, width, height) {
  const data = imageData.data
  const output = new Uint8ClampedArray(data.length)

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0
      let gy = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const gray = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114)

          const ki = (ky + 1) * 3 + (kx + 1)
          gx += gray * sobelX[ki]
          gy += gray * sobelY[ki]
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const idx = (y * width + x) * 4
      const edgeValue = Math.min(255, magnitude)

      output[idx] = edgeValue
      output[idx + 1] = edgeValue
      output[idx + 2] = edgeValue
      output[idx + 3] = 255
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const idx = (y * width + x) * 4
        output[idx] = data[idx]
        output[idx + 1] = data[idx + 1]
        output[idx + 2] = data[idx + 2]
        output[idx + 3] = data[idx + 3]
      }
    }
  }

  return new ImageData(output, width, height)
}

function posterize(imageData, levels = 8) {
  const data = imageData.data

  if (levels < 2) levels = 2
  const step = 255 / (levels - 1)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step
    data[i + 1] = Math.round(data[i + 1] / step) * step
    data[i + 2] = Math.round(data[i + 2] / step) * step
  }

  return imageData
}

function adjustSaturation(imageData, saturation) {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const gray = 0.299 * r + 0.587 * g + 0.114 * b

    data[i] = Math.min(255, Math.max(0, gray + (r - gray) * saturation))
    data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * saturation))
    data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * saturation))
  }

  return imageData
}

function adjustBrightness(imageData, brightness) {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] * brightness))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * brightness))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * brightness))
  }

  return imageData
}

function adjustContrast(imageData, contrast) {
  const data = imageData.data
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
  }

  return imageData
}

function applyPixelation(imageData, width, height, pixelSize) {
  const data = imageData.data
  const output = new Uint8ClampedArray(data.length)

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let r = 0, g = 0, b = 0, a = 0
      let count = 0

      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const idx = ((y + py) * width + (x + px)) * 4
          r += data[idx]
          g += data[idx + 1]
          b += data[idx + 2]
          a += data[idx + 3]
          count++
        }
      }

      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      a = Math.round(a / count)

      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const idx = ((y + py) * width + (x + px)) * 4
          output[idx] = r
          output[idx + 1] = g
          output[idx + 2] = b
          output[idx + 3] = a
        }
      }
    }
  }

  return new ImageData(output, width, height)
}

function blendEdgesWithImage(originalData, edgeData, width, height, strength) {
  const orig = originalData.data
  const edges = edgeData.data
  const output = new Uint8ClampedArray(orig.length)

  for (let i = 0; i < orig.length; i += 4) {
    const edgeVal = edges[i] / 255

    output[i] = Math.min(255, orig[i] * (1 - edgeVal * strength) + edges[i] * edgeVal * strength)
    output[i + 1] = Math.min(255, orig[i + 1] * (1 - edgeVal * strength) + edges[i + 1] * edgeVal * strength)
    output[i + 2] = Math.min(255, orig[i + 2] * (1 - edgeVal * strength) + edges[i + 2] * edgeVal * strength)
    output[i + 3] = Math.max(orig[i + 3], edges[i + 3])
  }

  return new ImageData(output, width, height)
}

export async function applyCartoonFilter(imageSource, options = {}) {
  try {
    const style = options.style || 'cute'
    const size = options.size || 1024
    const preset = stylePresets[style] || stylePresets.cute

    const img = await loadImage(imageSource)

    let canvasWidth = img.width
    let canvasHeight = img.height

    const maxSize = Math.min(size, 2048)
    if (canvasWidth > maxSize || canvasHeight > maxSize) {
      const scale = maxSize / Math.max(canvasWidth, canvasHeight)
      canvasWidth = Math.round(canvasWidth * scale)
      canvasHeight = Math.round(canvasHeight * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)

    if (style === 'pixel') {
      const pixelSize = Math.max(4, Math.round(Math.min(canvasWidth, canvasHeight) / 64))
      imageData = applyPixelation(imageData, canvasWidth, canvasHeight, pixelSize)
    } else {
      imageData = applyGaussianBlur(imageData, canvasWidth, canvasHeight, preset.blur)
    }

    imageData = posterize(imageData, preset.posterizeLevels)
    imageData = adjustBrightness(imageData, preset.brightness)
    imageData = adjustContrast(imageData, preset.contrast)
    imageData = adjustSaturation(imageData, preset.saturation)

    ctx.putImageData(imageData, 0, 0)

    const processedForEdges = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
    const edgeData = detectEdges(processedForEdges, canvasWidth, canvasHeight)
    const finalImageData = blendEdgesWithImage(imageData, edgeData, canvasWidth, canvasHeight, preset.edgeStrength)

    ctx.putImageData(finalImageData, 0, 0)

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('应用卡通滤镜失败:', error)
    throw new Error(`图像处理失败: ${error.message}`)
  }
}

export function getAvailableStyles() {
  return Object.keys(stylePresets).map(style => ({
    value: style,
    name: style.charAt(0).toUpperCase() + style.slice(1),
    description: getStyleDescription(style)
  }))
}

function getStyleDescription(style) {
  const descriptions = {
    cute: 'Q版萌系风格，大眼睛小身体',
    realistic: '写实卡通，保持自然比例',
    watercolor: '水彩画风，柔和艺术感',
    pixel: '像素风格，复古游戏感'
  }
  return descriptions[style] || '自定义风格'
}
