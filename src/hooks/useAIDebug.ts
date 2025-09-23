import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AIModel, Message, ModelConfig } from '@/types/ai-debug';
interface APIConfig {
  apiKey: string;
  baseUrl: string;
  urlSuffix: string;
  temperature: number;
  maxTokens: number;
}

export function useAIDebug() {
  // State for selected model
  const [selectedPlatform, setSelectedPlatform] = useState<AIModel>('');
  const [modelName, setModelName] = useState('');
  
  // State for API configurations
  const [modelConfigs, setModelConfigs] = useState<ModelConfig>(() => {
    const savedConfigs = localStorage.getItem('aiDebugConfigs');
    return savedConfigs ? JSON.parse(savedConfigs) : {};
  });
  
  // Initialize config for current model if it doesn't exist
  useEffect(() => {
    if (selectedPlatform && !modelConfigs[selectedPlatform]) {
      setModelConfigs(prev => ({
        ...prev,
         [selectedPlatform]: {
          apiKey: '',
          baseUrl: '',
          urlSuffix: '/chat/completions',
          modelName: '',
          temperature: 0.7,
          maxTokens: 2048
        }
      }));
    }
  }, [selectedPlatform]);
  
  // State for messages
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('aiDebugMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  
  // State for conversation mode
  const [streamingEnabled, setStreamingEnabled] = useState<boolean>(false);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Save configs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aiDebugConfigs', JSON.stringify(modelConfigs));
  }, [modelConfigs]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aiDebugMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Get current config
  const currentConfig = modelConfigs[selectedPlatform] || {};
  
  // Update config for current model
  const updateConfig = (config: Partial<APIConfig>) => {
    setModelConfigs(prev => ({
      ...prev,
      [selectedPlatform]: {
        ...prev[selectedPlatform],
        ...config
      }
    }));
  };
  
  // Add new message
  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    toast.info('消息已清空');
  };
  
  // Remove a specific message
  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };
  
  // Send message (real API implementation)
  const sendMessage = async (content: string) => {
    if (!currentConfig.apiKey) {
      toast.error('请先配置API Key');
      return;
    }
    
    if (!currentConfig.baseUrl) {
      toast.error('请先配置Base URL');
      return;
    }

    if (!currentConfig.modelName) {
      toast.error('请先配置模型名称');
      return;
    }
    
    // Add user message
    addMessage({ type: 'user', content });
    
    setIsLoading(true);
    
    try {
      // Prepare API request URL
      const apiUrl = `${currentConfig.baseUrl}${currentConfig.urlSuffix}`;
      
      // Prepare message history for API request
      const messageHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : msg.type === 'assistant' ? 'assistant' : 'system',
        content: msg.content
      }));
      
      // Add the new user message
      messageHistory.push({
        role: 'user',
        content: content
      });
      
      // Prepare request payload
      const payload = {
        model: currentConfig.modelName,
        messages: messageHistory,
        temperature: currentConfig.temperature,
        max_tokens: currentConfig.maxTokens,
        stream: streamingEnabled
      };
      
      // Headers for API request
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentConfig.apiKey}`
      };
      
      if (streamingEnabled) {
        // Handle streaming response
        const assistantMessageId = Date.now().toString();
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          type: 'assistant',
          content: '',
          reasoning_content: ''
        }]);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('无法读取流式响应');
        }
        
        let accumulatedContent = '';
        let accumulatedReasoningContent = '';
        
        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          
          // Process SSE format (data: {...})
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const jsonData = JSON.parse(line.substring(6));
                
                // 检查是否有思考内容
                const reasoningContent = jsonData.choices?.[0]?.delta?.reasoning_content || '';
                const content = jsonData.choices?.[0]?.delta?.content || '';
                
                // 立即更新UI以实现打字机效果
                if (content || reasoningContent) {
                  if (content) accumulatedContent += content;
                  if (reasoningContent) accumulatedReasoningContent += reasoningContent;
                  
                  // 立即更新消息，不等待整个响应完成
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { 
                      ...msg, 
                      content: accumulatedContent,
                      reasoning_content: accumulatedReasoningContent 
                    } : msg
                  ));
                }
              } catch (e) {
                console.error('解析流式数据失败:', e);
              }
            }
          }
        }
      } else {
        // Handle non-streaming response
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const assistantResponse = data.choices?.[0]?.message?.content || '无响应内容';
        const reasoningContent = data.choices?.[0]?.message?.reasoning_content || '';
        
        addMessage({ 
          type: 'assistant', 
          content: assistantResponse,
          reasoning_content: reasoningContent
        });
      }
      
    } catch (error) {
      toast.error('请求失败，请检查配置');
      console.error('API请求错误:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    selectedPlatform,
    setSelectedPlatform,
    modelName,
    setModelName,
    currentConfig,
    updateConfig,
    messages,
    addMessage,
    clearMessages,
    removeMessage,
    streamingEnabled,
    setStreamingEnabled,
    sendMessage,
    isLoading
  };
}