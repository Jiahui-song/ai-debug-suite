import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIResponseDisplayProps {
  content: string;
  thinking?: string;
  isLoading: boolean;
}

export function AIResponseDisplay({ content, thinking, isLoading }: AIResponseDisplayProps) {
  const [showThinking, setShowThinking] = useState(true);
  const [isThinkingCollapsed, setIsThinkingCollapsed] = useState(false);
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-100">AI回复</h3>
        
        {thinking && (
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">显示思考过程:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showThinking}
                onChange={(e) => setShowThinking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        )}
      </div>
      
      {/* 思考链部分 - 参考DeepSeek样式 */}
      {thinking && showThinking && (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <div 
            className="flex items-center mb-2 cursor-pointer" 
            onClick={() => setIsThinkingCollapsed(!isThinkingCollapsed)}
          >
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <h4 className="text-sm font-medium text-gray-300 flex-1">思考过程</h4>
            <button className="text-gray-400 hover:text-gray-200 focus:outline-none">
              <i className={`fa-solid ${isThinkingCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
            </button>
          </div>
          {!isThinkingCollapsed && (
            <div className="text-sm text-gray-400 whitespace-pre-wrap">
              {thinking}
            </div>
          )}
        </div>
      )}
      
      {/* Markdown渲染部分 */}
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
        {isLoading && !content ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">生成回复中...</span>
          </div>
        ) : content ? (
          <div className="markdown-body text-gray-200">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-10">
            <i className="fa-regular fa-comment-dots text-gray-500 text-4xl mb-3"></i>
            <p className="text-gray-500">AI回复将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
}