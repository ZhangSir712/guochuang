import { useState, useCallback, useRef, useEffect } from 'react';

const SpeechRecognition = typeof window !== 'undefined' 
  ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
  : null;

export const isSpeechRecognitionSupported = () => {
  return SpeechRecognition !== null;
};

export const useSpeechRecognition = (options = {}) => {
  const {
    lang = 'zh-CN',
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
    onResult,
    onError,
    onStart,
    onEnd,
  } = options;

  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setIsSupported(false);
      setError({ type: 'not_supported', message: '浏览器不支持 Web Speech API' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;

    recognition.onstart = () => {
      setStatus('listening');
      setError(null);
      isListeningRef.current = true;
      onStart?.();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interim);

      onResult?.({
        finalTranscript: transcript + finalTranscript,
        interimTranscript: interim,
        results: event.results,
      });
    };

    recognition.onerror = (event) => {
      let errorInfo = { type: event.error, message: '' };

      switch (event.error) {
        case 'no-speech':
          errorInfo.message = '未检测到语音，请重试';
          break;
        case 'audio-capture':
          errorInfo.message = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorInfo.message = '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风';
          break;
        case 'network':
          errorInfo.message = '网络错误，请检查网络连接';
          break;
        case 'aborted':
          errorInfo.message = '语音识别已取消';
          break;
        case 'language-not-supported':
          errorInfo.message = '不支持该语言';
          break;
        default:
          errorInfo.message = `语音识别错误: ${event.error}`;
      }

      setStatus('error');
      setError(errorInfo);
      isListeningRef.current = false;
      onError?.(errorInfo);
    };

    recognition.onend = () => {
      setStatus('idle');
      setInterimTranscript('');
      isListeningRef.current = false;
      onEnd?.();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // 忽略停止时的错误
        }
      }
    };
  }, [lang, continuous, interimResults, maxAlternatives, onResult, onError, onStart, onEnd, transcript]);

  const startListening = useCallback(async () => {
    if (!isSpeechRecognitionSupported()) {
      const errorInfo = { type: 'not_supported', message: '浏览器不支持 Web Speech API' };
      setError(errorInfo);
      onError?.(errorInfo);
      return;
    }

    if (isListeningRef.current) {
      return;
    }

    try {
      setStatus('processing');
      setError(null);
      
      // 请求麦克风权限
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      recognitionRef.current?.start();
    } catch (err) {
      let errorInfo;
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorInfo = { 
          type: 'not_allowed', 
          message: '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风' 
        };
      } else if (err.name === 'NotFoundError') {
        errorInfo = { 
          type: 'not_found', 
          message: '未找到麦克风设备' 
        };
      } else {
        errorInfo = { 
          type: 'unknown', 
          message: err.message || '启动语音识别失败' 
        };
      }

      setStatus('error');
      setError(errorInfo);
      onError?.(errorInfo);
    }
  }, [onError]);

  const stopListening = useCallback(() => {
    if (!isListeningRef.current || !recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('停止语音识别失败:', err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    status,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isListening: status === 'listening',
    isProcessing: status === 'processing',
    isIdle: status === 'idle',
    isError: status === 'error',
  };
};

export default useSpeechRecognition;
