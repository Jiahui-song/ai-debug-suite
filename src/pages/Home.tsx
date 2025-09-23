import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">AI调试工具</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          配置和测试不同AI模型的API接口，支持流式和非流式对话调试
        </p>
        <Link
          to="/ai-debug"
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          进入调试页面
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
}