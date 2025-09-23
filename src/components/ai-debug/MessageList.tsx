import { Message } from '@/types/ai-debug';
import { MessageItem } from './MessageItem';
import { useState } from 'react';

interface MessageListProps {
  messages: Message[];
  onRemoveMessage: (id: string) => void;
  onClearAll: () => void;
}

export function MessageList({ messages, onRemoveMessage, onClearAll }: MessageListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (messages.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-700">
        <i className="fa-regular fa-comment text-gray-300 text-5xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-300 mb-2">暂无消息</h3>
        <p className="text-gray-500 text-sm mb-4">添加消息开始您的对话</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
      <div 
        className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-gray-800/80 backdrop-blur-sm cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-medium text-gray-100">消息列表 ({messages.length})</h3>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
            className="text-sm text-red-500 hover:text-red-600 flex items-center"
          >
            <i className="fa-solid fa-trash mr-1"></i> 清空
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="text-gray-400 hover:text-gray-200"
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2 transition-all duration-300 ease-in-out">
          {messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              onRemove={(e) => {
                e.stopPropagation();
                onRemoveMessage(message.id);
              }}
            />
          ))}
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-4 text-center text-gray-400 text-sm py-6">
          <i className="fa-solid fa-angle-down mr-1"></i> 点击展开消息列表
        </div>
      )}
    </div>
  );
}