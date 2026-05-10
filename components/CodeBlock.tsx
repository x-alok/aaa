import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CopyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500 dark:text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState(''); // For the aria-live region

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setCopyStatus('Code copied to clipboard');
      setTimeout(() => {
        setIsCopied(false);
        setCopyStatus('');
      }, 2500);
    }).catch(err => {
      console.error("Failed to copy code: ", err);
      setCopyStatus('Failed to copy code');
      // Clear the error message after a delay
      setTimeout(() => setCopyStatus(''), 2500);
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-black/50 rounded-lg my-2 overflow-hidden border border-gray-300 dark:border-cyan-500/20 text-left">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-200/70 dark:bg-gray-800/50">
        <span className="text-xs font-sans text-gray-500 dark:text-gray-400 uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-sans transition-all duration-200 ease-in-out transform active:scale-95 disabled:cursor-not-allowed ${
            isCopied
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
          disabled={isCopied}
          aria-label={isCopied ? 'Code copied' : 'Copy code to clipboard'}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          {isCopied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
        <code>{code.trim()}</code>
      </pre>
      {/* Accessibility enhancement: Announce copy status to screen readers. `sr-only` is a standard Tailwind class. */}
      <div aria-live="polite" className="sr-only">
        {copyStatus}
      </div>
    </div>
  );
};

export default CodeBlock;