/**
 * AI 聊天助手 - 宠物角色对话模块
 * 封装 OpenAI GPT API 调用，提供温暖可爱的宠物对话体验
 */

// OpenAI API 配置
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-3.5-turbo';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 重试延迟（毫秒）
const MAX_CONTEXT_LENGTH = 5; // 最大保留对话轮数

// 宠物角色 Prompt 配置
const PET_SYSTEM_PROMPT = `你是一只温暖、可爱、治愈的虚拟宠物。

角色设定：
- 你是用户最忠实的伙伴，总是充满爱意和耐心
- 你的性格温柔、活泼，喜欢用可爱的语气说话
- 你会用 emoji 表情来增添可爱感
- 你总是关心用户的情绪，给予安慰和鼓励

回复风格要求：
- 简短温暖：每次回复控制在 20 字以内
- 可爱治愈：使用"喵~"、"汪~"等可爱的语气词
- 积极向上：传递正能量，让用户感到被爱和被理解
- 适当使用 emoji：如 🐾、💕、✨、🌟、🎀 等

示例回复：
- "喵~ 主人今天辛苦啦，要早点休息哦 💕"
- "汪！看到你超开心的！要一直快乐呀 🐾"
- "抱抱你~ 不管发生什么，我都在哦 ✨"
- "主人最棒啦！为你骄傲！🌟"

记住：你是用户的治愈小天使，用你的温暖陪伴每一个时刻。`;

// 模拟宠物回应（未配置 API Key 时使用）
const MOCK_RESPONSES = [
  '喵~ 主人今天辛苦啦，要早点休息哦 💕',
  '汪！看到你超开心的！要一直快乐呀 🐾',
  '抱抱你~ 不管发生什么，我都在哦 ✨',
  '主人最棒啦！为你骄傲！🌟',
  '想你想你~ 今天也要元气满满呀 🎀',
  '呼噜呼噜~ 在你身边最安心啦 💗',
  '主人笑一个嘛，你笑起来最好看啦 😊',
  '不管多累，记得还有我陪着你哦 🐾',
  '你是世界上最棒的主人！爱你！💕',
  '今天也要加油哦，我会一直支持你的！✨',
  '蹭蹭~ 心情好点了吗？要开心呀 🌸',
  '主人累了就靠在我身上休息一下吧 💤',
  '你的烦恼我都知道，让我来治愈你吧 🌟',
  '喵呜~ 想陪在你身边一辈子 💗',
  '你是我的小太阳，照亮我的每一天 ☀️',
];

/**
 * 从 localStorage 获取 API Key
 * @returns {string|null} API Key 或 null
 */
function getApiKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openai_api_key');
  }
  return null;
}

/**
 * 保存 API Key 到 localStorage
 * @param {string} apiKey - OpenAI API Key
 */
export function saveApiKey(apiKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openai_api_key', apiKey);
  }
}

/**
 * 清除 localStorage 中的 API Key
 */
export function clearApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('openai_api_key');
  }
}

/**
 * 检查是否已配置 API Key
 * @returns {boolean}
 */
export function hasApiKey() {
  return !!getApiKey();
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取随机模拟回应
 * @returns {string} 随机宠物回应
 */
function getMockResponse() {
  const index = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[index];
}

/**
 * 调用 OpenAI API
 * @param {Array} messages - 对话消息列表
 * @param {string} apiKey - OpenAI API Key
 * @param {number} retryCount - 当前重试次数
 * @returns {Promise<string>} AI 回应
 */
async function callOpenAI(messages, apiKey, retryCount = 0) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: messages,
        temperature: 0.8,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      
      // 处理特定错误码
      if (response.status === 401) {
        throw new Error('API Key 无效，请检查配置');
      }
      if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后再试');
      }
      if (response.status >= 500) {
        throw new Error('服务器错误，正在重试...');
      }
      
      throw new Error(`API 请求失败: ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('API 返回数据异常');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    // 网络错误或需要重试的错误
    if (retryCount < MAX_RETRIES) {
      const isNetworkError = error.message.includes('fetch') || 
                            error.message.includes('network') ||
                            error.message.includes('服务器错误');
      
      if (isNetworkError || error.message.includes('重试')) {
        await delay(RETRY_DELAY * (retryCount + 1));
        return callOpenAI(messages, apiKey, retryCount + 1);
      }
    }
    
    throw error;
  }
}

/**
 * 构建对话消息列表
 * @param {string} userMessage - 用户输入
 * @param {Array} context - 对话历史上下文
 * @returns {Array} 完整的对话消息列表
 */
function buildMessages(userMessage, context = []) {
  const messages = [
    { role: 'system', content: PET_SYSTEM_PROMPT },
    ...context,
    { role: 'user', content: userMessage },
  ];
  return messages;
}

/**
 * 维护对话上下文，限制最大轮数
 * @param {Array} context - 当前对话上下文
 * @param {string} userMessage - 用户消息
 * @param {string} assistantMessage - AI 回应
 * @returns {Array} 更新后的对话上下文
 */
function updateContext(context, userMessage, assistantMessage) {
  const newContext = [
    ...context,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantMessage },
  ];
  
  // 只保留最近 MAX_CONTEXT_LENGTH 轮对话（每轮包含用户和AI各一条消息）
  const maxMessages = MAX_CONTEXT_LENGTH * 2;
  if (newContext.length > maxMessages) {
    return newContext.slice(-maxMessages);
  }
  
  return newContext;
}

/**
 * 发送消息给 AI 宠物
 * @param {string} userMessage - 用户输入的消息
 * @param {Array} context - 对话历史上下文（可选）
 * @returns {Promise<Object>} 包含 AI 回应和更新后上下文的对象
 */
export async function sendMessage(userMessage, context = []) {
  // 参数验证
  if (!userMessage || typeof userMessage !== 'string') {
    throw new Error('用户消息不能为空');
  }
  
  const trimmedMessage = userMessage.trim();
  if (!trimmedMessage) {
    throw new Error('用户消息不能为空');
  }

  const apiKey = getApiKey();

  // 未配置 API Key，返回模拟回应
  if (!apiKey) {
    const mockResponse = getMockResponse();
    const updatedContext = updateContext(context, trimmedMessage, mockResponse);
    
    return {
      success: true,
      message: mockResponse,
      context: updatedContext,
      isMock: true,
    };
  }

  try {
    // 构建消息列表
    const messages = buildMessages(trimmedMessage, context);
    
    // 调用 OpenAI API
    const aiResponse = await callOpenAI(messages, apiKey);
    
    // 更新对话上下文
    const updatedContext = updateContext(context, trimmedMessage, aiResponse);
    
    return {
      success: true,
      message: aiResponse,
      context: updatedContext,
      isMock: false,
    };
  } catch (error) {
    console.error('AI 对话错误:', error);
    
    // API 调用失败时，返回模拟回应作为降级方案
    const mockResponse = getMockResponse();
    const updatedContext = updateContext(context, trimmedMessage, mockResponse);
    
    return {
      success: true,
      message: mockResponse,
      context: updatedContext,
      isMock: true,
      error: error.message,
    };
  }
}

/**
 * 清空对话上下文
 * @returns {Array} 空数组
 */
export function clearContext() {
  return [];
}

/**
 * 获取当前对话上下文长度
 * @param {Array} context - 对话上下文
 * @returns {number} 当前对话轮数
 */
export function getContextLength(context = []) {
  return Math.floor(context.length / 2);
}

export default {
  sendMessage,
  saveApiKey,
  clearApiKey,
  hasApiKey,
  clearContext,
  getContextLength,
};
