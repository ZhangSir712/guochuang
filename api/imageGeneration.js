const API_ENDPOINT = 'https://api.openai.com/v1/images/generations'
const TIMEOUT_MS = 30000

const stylePrompts = {
  cute: (pet) =>
    `An adorable chibi-style cartoon illustration of ${pet}, with big sparkling eyes, small body, kawaii aesthetic, soft pastel colors, adorable expression, high quality digital art`,
  realistic: (pet) =>
    `A realistic cartoon style illustration of ${pet}, maintaining natural proportions but with simplified features and smooth lines, warm lighting, professional digital artwork`,
  watercolor: (pet) =>
    `A beautiful watercolor painting of ${pet}, soft brush strokes, gentle color blending, artistic and dreamy atmosphere, delicate details, traditional watercolor technique`,
  pixel: (pet) =>
    `A retro pixel art depiction of ${pet}, 16-bit style, vibrant colors, nostalgic video game aesthetic, clean pixel details, charming pixelated design`
}

const personalityDescriptors = {
  clingy: 'expressive affectionate eyes, loving gaze, tender expression',
  playful: 'energetic pose, joyful expression, dynamic action, lively posture',
  calm: 'serene expression, peaceful posture, gentle demeanor, relaxed stance',
  smart: 'alert intelligent eyes, curious expression, focused gaze',
  naughty: 'mischievous expression, playful pose, teasing look',
  lazy: 'relaxed pose, drowsy expression, comfortable posture, sleepy demeanor',
  brave: 'confident stance, proud expression, alert ears, bold posture',
  friendly: 'warm friendly expression, open welcoming pose, gentle smile',
  aloof: 'elegant poised posture, dignified expression, subtle smile, independent air'
}

export function buildPrompt(config, petDescription = '') {
  const pet = petDescription?.trim() ? petDescription : 'a lovely pet'

  const styleKey = config.style && stylePrompts[config.style] ? config.style : 'realistic'
  let basePrompt = stylePrompts[styleKey](pet)

  if (config.background === 'transparent') {
    basePrompt += ', isolated on transparent background, no background'
  } else if (config.background === 'white') {
    basePrompt += ', clean white background'
  } else if (config.background === 'gradient') {
    basePrompt += ', beautiful gradient background with soft colors'
  }

  if (config.personalityTags && config.personalityTags.length > 0) {
    const descriptors = config.personalityTags
      .map(tag => personalityDescriptors[tag])
      .filter(Boolean)
    if (descriptors.length > 0) {
      basePrompt += ', ' + descriptors.join(', ')
    }
  }

  return basePrompt
}

export async function generateWithDALLE(params) {
  const { apiKey, prompt, size = '1024x1024', quality = 'standard', referenceImages = [] } = params

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('请提供有效的API密钥')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    let finalPrompt = prompt

    if (referenceImages && referenceImages.length > 0) {
      finalPrompt = `${prompt}. Reference images provided for style consistency. Maintain similar characteristics while creating a new unique illustration.`
    }

    const requestBody = {
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size: size,
      quality: quality,
      response_format: 'url'
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      handleApiError(response.status, errorData)
    }

    const data = await response.json()

    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('API返回数据格式异常，无法获取生成的图像')
    }

    return {
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt || prompt
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      throw new Error('请求超时，AI生成时间过长，请稍后重试')
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('网络连接失败，请检查网络连接后重试')
    }

    throw error
  }
}

function handleApiError(statusCode, errorData) {
  switch (statusCode) {
    case 401:
      throw new Error('API密钥无效，请检查后重试')
    case 429:
      const retryAfter = errorData.headers?.['retry-after']
      const message = retryAfter
        ? `请求过于频繁，请在 ${retryAfter} 秒后重试`
        : '请求过于频繁，请稍后再试'
      throw new Error(message)
    case 400:
      throw new Error(`请求参数错误: ${errorData.error?.message || '请检查输入参数'}`)
    case 500:
    case 502:
    case 503:
      throw new Error('服务器暂时不可用，请稍后重试')
    default:
      throw new Error(`请求失败 (${statusCode}): ${errorData.error?.message || '未知错误'}`)
  }
}

export async function validateApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, error: 'API密钥不能为空' }
  }

  try {
    const testResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: 'test',
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      })
    })

    if (testResponse.status === 401) {
      return { valid: false, error: 'API密钥无效' }
    }

    if (testResponse.ok) {
      return { valid: true, error: null }
    }

    return { valid: false, error: 'API密钥验证失败' }
  } catch (error) {
    return { valid: false, error: '网络错误，无法验证API密钥' }
  }
}
