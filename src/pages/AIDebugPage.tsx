import { ModelSelector } from '@/components/ai-debug/ModelSelector';
import { APIConfigForm } from '@/components/ai-debug/APIConfigForm';
import { MessageList } from '@/components/ai-debug/MessageList';
import { MessageInput } from '@/components/ai-debug/MessageInput';
import { ConversationControls } from '@/components/ai-debug/ConversationControls';
import { AIResponseDisplay } from '@/components/ai-debug/AIResponseDisplay';
import { useAIDebug } from '@/hooks/useAIDebug';

import { useTheme } from '@/hooks/useTheme';

export default function AIDebugPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    selectedPlatform,
    setSelectedPlatform,
    modelName,
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
  } = useAIDebug();
  
  const handleAddMessage = (type: 'user' | 'system', content: string) => {
    addMessage({ type, content });
  };
  
  // 获取最新的AI回复消息
  const getLatestAIResponse = () => {
    const assistantMessages = messages.filter(msg => msg.type === 'assistant');
    return assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1].content : '';
  };

  // 获取最新的AI思考链内容
  const getLatestAIThinking = () => {
    const assistantMessages = messages.filter(msg => msg.type === 'assistant');
    return assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1].reasoning_content || '' : '';
  };
  
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">AI调试工具</h1>
            <p className="text-gray-400">配置AI模型API并测试对话功能</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Configuration */}
          <div className="lg:col-span-5 space-y-4">
            <ModelSelector 
              platform={selectedPlatform} 
              onPlatformChange={setSelectedPlatform} 
            />
            
            <APIConfigForm 
              config={currentConfig} 
              onUpdateConfig={updateConfig}
              modelName={modelName}
            />
            
            <MessageInput onAddMessage={handleAddMessage} />
            
            <MessageList 
              messages={messages} 
              onRemoveMessage={removeMessage}
              onClearAll={clearMessages}
            />
            
            <ConversationControls 
              streamingEnabled={streamingEnabled} 
              onStreamingToggle={setStreamingEnabled}
              onSend={sendMessage}
              isLoading={isLoading}
            />
          </div>
          
          {/* Right column - AI Response Display */}
          <div className="lg:col-span-7 space-y-4">
            <AIResponseDisplay 
              content={getLatestAIResponse()}
              thinking={getLatestAIThinking()}
              isLoading={isLoading}
            />
            
            <div className="text-center text-xs text-gray-500 mt-6">
              <p>注意：此工具用于调试，API调用将发送到真实的AI服务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}