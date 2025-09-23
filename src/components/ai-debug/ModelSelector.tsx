import { useState, useEffect } from 'react';

interface ModelSelectorProps {
  platform: string;
  onPlatformChange: (platform: string) => void;
}

export function ModelSelector({ platform, onPlatformChange }: ModelSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(platform);
  
  // 平台选项
  const platforms = [
    { value: 'deepseek', label: 'DeepSeek' },
    { value: 'qwen', label: 'Qwen' },
    { value: 'zhipu', label: '智谱清言' },
    { value: 'kimi', label: 'Kimi' }
  ];
  
  useEffect(() => {
    setSelectedPlatform(platform);
  }, [platform]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onPlatformChange(value);
  };
  
  return (
    <div className="mb-6 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700 transition-all duration-300 hover:shadow-xl">
      <label className="block text-sm font-medium text-gray-300 mb-2">平台</label>
      <select
        value={selectedPlatform}
        onChange={handleChange}
        className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-900 text-gray-200 appearance-none"
      >
        <option value="">选择平台</option>
        {platforms.map(platform => (
          <option key={platform.value} value={platform.value}>
            {platform.label}
          </option>
        ))}
      </select>
    </div>
  );
}