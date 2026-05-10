import React, { useState, useRef, useEffect } from 'react';

// FIX: Add SpeechRecognition types to the Window object to fix TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSend: (text: string, file?: File | null) => void;
  isLoading: boolean;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const MicrophoneIcon = ({ isListening }: { isListening: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 transition-colors ${isListening ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5A.75.75 0 0 1 6 10.5Z" />
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null); // For SpeechRecognition instance
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSpeechSupported = !!(
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );

  useEffect(() => {
    if (!isSpeechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognitionRef.current = recognition;
  }, [isSpeechSupported]);

  const handleToggleListening = () => {
    if (!recognitionRef.current || isLoading) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputText.trim() || selectedFile) && !isLoading) {
      onSend(inputText, selectedFile);
      setInputText('');
      handleClearFile();
    }
  };

  return (
    <div className="p-2 sm:p-4 border-t border-cyan-500/10 dark:border-cyan-500/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {selectedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 text-sm bg-cyan-100 dark:bg-cyan-900/50 rounded-lg text-cyan-800 dark:text-cyan-200">
                <span className="truncate">{selectedFile.name}</span>
                <button type="button" onClick={handleClearFile} className="ml-2 text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-100">
                    <XCircleIcon/>
                </button>
            </div>
        )}
        <div className="flex items-center space-x-2">
            <label htmlFor="file-upload" className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors text-gray-600 dark:text-gray-300">
                <PaperclipIcon />
                <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    disabled={isLoading}
                />
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your message here..."}
              disabled={isLoading}
              className="flex-1 w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            />
            {isSpeechSupported && (
               <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={isLoading}
                  className={`p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isListening ? 'bg-cyan-100 dark:bg-cyan-900/50' : ''}`}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
               >
                  <MicrophoneIcon isListening={isListening} />
               </button>
            )}
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedFile)}
              className="p-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              <SendIcon />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;