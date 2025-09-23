import { APIConfig } from '@/types/ai-debug';



import { useState } from 'react';
import { AIModel } from '@/types/ai-debug';

interface APIConfigFormProps {
  config: APIConfig;
  onUpdateConfig: (config: Partial<APIConfig>) => void;
  modelName: string;
}

export function APIConfigForm({ config, onUpdateConfig, modelName }: APIConfigFormProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  // Map model value to display name
  const getModelDisplayName = (model: string): string => {
    const modelNames: Record<string, string> = {
      'deepseek': 'DeepSeek',
      'qwen': 'Qwen',
      'zhipu': '智谱清言',
      'kimi': 'Kimi',
      'ernie': '文心一言'
    };
    return modelNames[model] || model;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-5 mb-6 transition-all duration-300 hover:shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-100">{getModelDisplayName(modelName)}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => onUpdateConfig({ apiKey: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="输入API Key"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <i className={`fa-solid ${showApiKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base URL</label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => onUpdateConfig({ baseUrl: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
           <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">URL 后缀</label>
          <input
            type="text"
            value={config.urlSuffix}
            onChange={(e) => onUpdateConfig({ urlSuffix: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">模型名称</label>
          <input
            type="text"
            value={config.modelName || ''}
            onChange={(e) => onUpdateConfig({ modelName: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="输入模型名称"
          />
        </div>
      </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">温度</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => onUpdateConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">最大Token</label>
            <input
              type="number"
              min="100"
              value={config.maxTokens}
              onChange={(e) => onUpdateConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        

      </div>
    </div>
  );
}