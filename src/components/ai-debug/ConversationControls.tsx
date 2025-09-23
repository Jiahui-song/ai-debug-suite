import { useState } from 'react';

interface ConversationControlsProps {
  streamingEnabled: boolean;
  onStreamingToggle: (enabled: boolean) => void;
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ConversationControls({ streamingEnabled, onStreamingToggle, onSend, isLoading }: ConversationControlsProps) {
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSend(inputMessage.trim());
    setInputMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-100">对话控制</h3>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">流式模式:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={streamingEnabled}
              onChange={(e) => onStreamingToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的消息..."
          className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-900 text-gray-200"
          rows={3}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex">
        <div className="w-full">
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i> 处理中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane mr-2"></i> 发送消息
              </>
            )}
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm">AI正在回复中...</p>
        </div>
      )}
    </div>
  );
}