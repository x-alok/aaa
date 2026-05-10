import React from 'react';
import BotAvatar from './BotAvatar';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="flex-shrink-0 mt-1">
        <BotAvatar />
      </div>
      <div className="max-w-[85%] sm:max-w-md lg:max-w-lg w-full">
          <div className="rounded-2xl rounded-bl-none shadow-lg bg-gradient-to-br from-cyan-500/40 via-cyan-500/10 to-transparent p-[1px]">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#24243e] dark:to-[#1a1a2e] px-4 py-3 rounded-[15px] rounded-bl-none text-gray-800 dark:text-gray-100">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.32s]"></div>
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.16s]"></div>
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;