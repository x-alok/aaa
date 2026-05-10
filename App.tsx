import React, { useState, useEffect } from 'react';
import { Message, Sender } from './types';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ThemeToggler from './components/ThemeToggler';
import { sendMessageToBot } from './services/geminiService';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('alok-bot-chat-history');
      return savedMessages ? JSON.parse(savedMessages) : [
        {
          id: 'initial-message',
          text: "Hi! I'm Alok — coding brains with AI smarts, ready to power up your day. ✨",
          sender: Sender.Bot
        }
      ];
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
     const savedTheme = localStorage.getItem('theme');
     return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('alok-bot-chat-history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: 'light' | 'dark') => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = async (inputText: string, file?: File) => {
    if ((!inputText || !inputText.trim()) && !file) {
      setError('Please enter a message or upload a file.');
      return;
    }

    const userMessageText = file
      ? `${inputText || "Uploaded an image."}\n(File: ${file.name})`
      : inputText;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: Sender.User,
    };

    const currentHistory = messages;
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponseText = await sendMessageToBot(currentHistory, inputText, file);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: Sender.Bot,
      };
      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
      setMessages((prev: Message[]) => [...prev, { id: 'error-msg', text: errorMessage, sender: Sender.Bot }]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:via-blue-900/40 dark:to-cyan-900/30 text-gray-900 dark:text-white flex flex-col items-center justify-center p-2 sm:p-4 font-sans transition-colors duration-500">
      <div className="w-full max-w-3xl h-full flex flex-col border border-cyan-500/10 dark:border-cyan-500/30 rounded-2xl shadow-2xl shadow-blue-500/10 dark:shadow-cyan-900/50 bg-white/50 dark:bg-black/30 backdrop-blur-xl">
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-cyan-500/10 dark:border-cyan-500/30">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse mr-3"></div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
              Alok Bot
            </h1>
          </div>
          <ThemeToggler theme={theme} toggleTheme={toggleTheme} />
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} />
        {error && <div className="text-red-500 dark:text-red-400 px-3 sm:px-4 py-2 text-sm">{error}</div>}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
       <footer className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Powered by Alok ❣️</p>
        </footer>
    </div>
  );
};