import { Message } from '@/types/ai-debug';

interface MessageItemProps {
  message: Message;
  onRemove: (id: string) => void;
}

export function MessageItem({ message, onRemove }: MessageItemProps) {
  // Determine style based on message type
  const getTypeStyles = () => {
    switch (message.type) {
      case 'system':
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: 'fa-cog'
        };
      case 'assistant':
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/30',
          borderColor: 'border-blue-100 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-100',
          icon: 'fa-robot'
        };
      case 'user':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/30',
          borderColor: 'border-green-100 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-100',
          icon: 'fa-user'
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className={`mb-3 p-4 rounded-xl ${styles.bgColor} border ${styles.borderColor} relative group transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start">
        <i className={`fa-solid ${styles.icon} mr-3 mt-1 ${styles.textColor}`}></i>
        <div className="flex-1">
          <div className="font-medium text-sm capitalize mb-1">{message.type}</div>
          <div className={`text-sm ${styles.textColor} whitespace-pre-wrap`}>
            {message.content}
            {message.type === 'assistant' && message.content === '' && (
              <span className="text-gray-500 italic">生成中...</span>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
      >
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
}