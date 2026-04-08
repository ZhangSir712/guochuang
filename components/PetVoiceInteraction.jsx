'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeechRecognition } from '../utils/speechRecognition';
import { sendMessage, saveApiKey, hasApiKey, clearContext } from '../utils/chatAI';

// 快捷对话选项
const QUICK_MESSAGES = [
  '你好呀',
  '今天怎么样',
  '给我讲个笑话',
  '我有点难过',
  '想你了',
  '陪我玩',
];

// 语音合成播放函数
const speakText = (text, onEnd) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  // 取消之前的语音
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 1;
  utterance.pitch = 1.2; // 稍微高一点的声音，更可爱
  utterance.volume = 1;

  // 尝试选择一个更可爱的声音
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(v => v.lang.includes('zh'));
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
};

// 停止语音合成
const stopSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// 波形动画组件
const WaveformAnimation = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-pink-400 rounded-full animate-wave"
          style={{
            height: '20px',
            animationDelay: `${i * 0.1}s`,
            animation: 'wave 0.6s ease-in-out infinite alternate',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: scaleY(0.3);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

// 消息气泡组件
const MessageBubble = ({ message, isUser, isError }) => {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-md'
            : isError
            ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-md'
            : 'bg-white text-gray-700 border border-pink-100 rounded-bl-md shadow-sm'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

// 加载指示器组件
const ThinkingIndicator = () => {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.15s' }}
          />
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    </div>
  );
};

// 主组件
const PetVoiceInteraction = () => {
  // 状态管理
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [enableTTS, setEnableTTS] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [context, setContext] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 语音识别 hook
  const {
    isSupported,
    status,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isListening,
    isProcessing,
  } = useSpeechRecognition({
    lang: 'zh-CN',
    continuous: false,
    interimResults: true,
    onResult: ({ finalTranscript }) => {
      if (finalTranscript && !isListening) {
        handleSendMessage(finalTranscript);
      }
    },
    onError: (err) => {
      console.error('语音识别错误:', err);
      addMessage(err.message, false, true);
    },
  });

  // 从 localStorage 加载数据
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 加载对话历史
    const savedMessages = localStorage.getItem('pet_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.messages || []);
        setContext(parsed.context || []);
      } catch (e) {
        console.error('加载对话历史失败:', e);
      }
    }

    // 加载 TTS 设置
    const savedTTS = localStorage.getItem('pet_tts_enabled');
    if (savedTTS !== null) {
      setEnableTTS(savedTTS === 'true');
    }

    // 检查是否需要显示 API Key 输入
    setShowApiInput(!hasApiKey());
  }, []);

  // 保存对话历史到 localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      'pet_chat_history',
      JSON.stringify({ messages, context })
    );
  }, [messages, context]);

  // 保存 TTS 设置
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('pet_tts_enabled', enableTTS.toString());
  }, [enableTTS]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // 处理发送消息
  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isThinking) return;

      // 添加用户消息
      const userMessage = { text: text.trim(), isUser: true, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      try {
        // 发送给 AI
        const response = await sendMessage(text.trim(), context);

        // 更新上下文
        setContext(response.context);

        // 添加 AI 回应
        const petMessage = {
          text: response.message,
          isUser: false,
          timestamp: Date.now(),
          isMock: response.isMock,
        };
        setMessages((prev) => [...prev, petMessage]);

        // 语音合成
        if (enableTTS && !isSpeaking) {
          setIsSpeaking(true);
          speakText(response.message, () => {
            setIsSpeaking(false);
          });
        }
      } catch (err) {
        console.error('发送消息失败:', err);
        addMessage('抱歉，我遇到了一些问题，请稍后再试~', false, true);
      } finally {
        setIsThinking(false);
        resetTranscript();
      }
    },
    [context, enableTTS, isSpeaking, isThinking, resetTranscript]
  );

  // 添加消息到列表
  const addMessage = (text, isUser, isError = false) => {
    setMessages((prev) => [
      ...prev,
      { text, isUser, isError, timestamp: Date.now() },
    ]);
  };

  // 处理麦克风点击
  const handleMicClick = async () => {
    if (!isSupported) {
      addMessage('您的浏览器不支持语音识别功能', false, true);
      return;
    }

    if (isListening) {
      stopListening();
      // 如果有识别结果，发送消息
      const fullTranscript = transcript + interimTranscript;
      if (fullTranscript.trim()) {
        await handleSendMessage(fullTranscript);
      }
    } else {
      resetTranscript();
      await startListening();
      setShowChat(true);
    }
  };

  // 处理快捷消息点击
  const handleQuickMessage = (message) => {
    handleSendMessage(message);
    setShowChat(true);
  };

  // 保存 API Key
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setShowApiInput(false);
      addMessage('API Key 已保存！现在可以使用完整的 AI 对话功能啦~', false);
    }
  };

  // 清除 API Key
  const handleClearApiKey = () => {
    setApiKey('');
    setShowApiInput(true);
    addMessage('API Key 已清除，将使用模拟回复模式', false);
  };

  // 清除对话历史
  const handleClearHistory = () => {
    setMessages([]);
    setContext(clearContext());
    stopSpeaking();
    setIsSpeaking(false);
  };

  // 切换 TTS
  const toggleTTS = () => {
    setEnableTTS((prev) => {
      if (prev) {
        stopSpeaking();
        setIsSpeaking(false);
      }
      return !prev;
    });
  };

  // 重播语音
  const replayVoice = (text) => {
    if (enableTTS) {
      stopSpeaking();
      setIsSpeaking(true);
      speakText(text, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* API Key 配置面板 */}
      {showApiInput && (
        <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 animate-fadeIn">
          <p className="text-sm text-gray-600 mb-2">
            💡 配置 OpenAI API Key 可获得更智能的对话体验
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入您的 OpenAI API Key"
              className="flex-1 px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              保存
            </button>
          </div>
          <button
            onClick={() => setShowApiInput(false)}
            className="mt-2 text-xs text-gray-500 hover:text-pink-500 underline"
          >
            暂不配置，使用模拟回复
          </button>
        </div>
      )}

      {/* 对话面板 */}
      {showChat && (
        <div
          ref={chatContainerRef}
          className="mb-4 bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden animate-fadeIn"
        >
          {/* 面板头部 */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐾</span>
              <span className="text-sm font-medium text-gray-700">宠物伙伴</span>
              {hasApiKey() && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                  AI
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* TTS 开关 */}
              <button
                onClick={toggleTTS}
                className={`p-1.5 rounded-full transition-colors ${
                  enableTTS
                    ? 'bg-pink-100 text-pink-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={enableTTS ? '关闭语音' : '开启语音'}
              >
                {enableTTS ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              {/* 清除历史 */}
              <button
                onClick={handleClearHistory}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                title="清除对话"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              {/* 关闭面板 */}
              <button
                onClick={() => setShowChat(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="h-64 overflow-y-auto p-4 bg-gradient-to-b from-pink-50/30 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-4xl mb-2">🐾</span>
                <p className="text-sm">点击麦克风开始对话吧~</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className="group">
                    <MessageBubble
                      message={msg.text}
                      isUser={msg.isUser}
                      isError={msg.isError}
                    />
                    {/* 重播按钮 - 仅对宠物消息显示 */}
                    {!msg.isUser && !msg.isError && enableTTS && (
                      <div className="flex justify-start mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => replayVoice(msg.text)}
                          className="text-xs text-pink-400 hover:text-pink-600 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                          重播
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isThinking && <ThinkingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 快捷消息按钮 */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">快捷对话：</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_MESSAGES.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(msg)}
                  disabled={isThinking}
                  className="px-3 py-1.5 text-xs bg-white border border-pink-200 text-pink-600 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors disabled:opacity-50"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 麦克风控制区 */}
      <div className="flex flex-col items-center gap-4">
        {/* 波形动画 */}
        {(isListening || isProcessing) && (
          <div className="h-8">
            <WaveformAnimation isActive={isListening || isProcessing} />
          </div>
        )}

        {/* 识别中的文字提示 */}
        {isListening && (transcript || interimTranscript) && (
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100">
            {transcript}
            <span className="text-pink-400">{interimTranscript}</span>
          </div>
        )}

        {/* 麦克风按钮 */}
        <div className="relative">
          {/* 脉冲动画环 */}
          {(isListening || isProcessing) && (
            <>
              <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20" />
              <div
                className="absolute inset-0 rounded-full bg-pink-300 animate-ping opacity-30"
                style={{ animationDelay: '0.3s' }}
              />
            </>
          )}

          <button
            onClick={handleMicClick}
            disabled={isProcessing || !isSupported}
            className={`
              relative w-16 h-16 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-lg
              ${
                isListening
                  ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 scale-110'
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 cursor-wait'
                  : 'bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 hover:scale-105'
              }
              ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isListening ? (
              // 停止图标
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <rect x="6" y="6" width="8" height="8" rx="1" />
              </svg>
            ) : isProcessing ? (
              // 加载图标
              <svg
                className="w-7 h-7 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              // 麦克风图标
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* 状态提示文字 */}
        <p className="text-sm text-gray-500">
          {!isSupported
            ? '浏览器不支持语音识别'
            : isListening
            ? '正在聆听... 点击停止'
            : isProcessing
            ? '正在处理...'
            : isSpeaking
            ? '正在说话...'
            : '点击麦克风开始对话'}
        </p>

        {/* 打开对话面板按钮（当面板关闭时显示） */}
        {!showChat && messages.length > 0 && (
          <button
            onClick={() => setShowChat(true)}
            className="text-sm text-pink-500 hover:text-pink-600 underline"
          >
            查看对话历史 ({messages.length} 条消息)
          </button>
        )}

        {/* API Key 管理链接 */}
        {!showApiInput && (
          <button
            onClick={handleClearApiKey}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            重新配置 API Key
          </button>
        )}
      </div>
    </div>
  );
};

export default PetVoiceInteraction;
