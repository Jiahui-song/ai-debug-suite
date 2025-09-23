import { useState } from 'react';

interface MessageInputProps {
  onAddMessage: (type: 'user' | 'system', content: string) => void;
}

export function MessageInput({ onAddMessage }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<'user' | 'system' | 'assistant'>('user');
  
  const handleAdd = () => {
    if (!content.trim()) return;
    
    onAddMessage(messageType, content.trim());
    setContent('');
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700 mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-300 mr-3">添加消息:</label>
        <div className="flex space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="messageType"
              value="system"
              checked={messageType === 'system'}
              onChange={() => setMessageType('system')}
              className="mr-1"
            />
            <span className="text-sm text-gray-300">系统</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="messageType"
              value="user"
              checked={messageType === 'user'}
              onChange={() => setMessageType('user')}
              className="mr-1"
            />
            <span className="text-sm text-gray-300">用户</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="messageType"
              value="assistant"
              checked={messageType === 'assistant'}
              onChange={() => setMessageType('assistant')}
              className="mr-1"
            />
            <span className="text-sm text-gray-300">助手</span>
          </label>
        </div>
      </div>
      
      <div className="flex">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`输入${messageType === 'user' ? '用户' : messageType === 'system' ? '系统' : '助手'}消息...`}
          className="flex-1 p-3 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-900 text-gray-200"
          rows={3}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!content.trim()}
          className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed hover:shadow-md"
          title="添加消息"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  );
}