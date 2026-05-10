import React from 'react';
import { Message, Sender } from '../types';
import BotAvatar from './BotAvatar';
import CodeBlock from './CodeBlock';

interface MessageBubbleProps {
  message: Message;
}

// Renders text content, parsing for paragraphs, lists, bold, italics, and inline code.
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Helper to parse a line for inline formatting (bold, italic, and code)
  const parseInline = (line: string) => {
    // Regex to find **bold**, *italic*, or `inline code`, keeping delimiters.
    // The order in the regex is important: check for ** first, then *.
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).filter(Boolean);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-200 dark:bg-gray-900/70 text-cyan-600 dark:text-cyan-300 rounded px-1.5 py-1 font-mono text-xs mx-0.5 border border-cyan-300 dark:border-cyan-500/20">{part.slice(1, -1)}</code>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const elements: React.ReactNode[] = [];
  const lines = text.trim().split('\n');
  let currentList: string[] = [];

  // Flushes any accumulated list items into a <ul> element
  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-3 pl-2">
          {currentList.map((item, index) => (
            <li key={index} className="text-sm leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = []; // Reset the list
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    // Check if the line is a list item
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      currentList.push(trimmedLine.substring(2).trim());
    } else {
      flushList(); // A non-list line ends the current list
      if (trimmedLine) { // Add non-empty lines as paragraphs
        elements.push(
          <p key={`p-${elements.length}`} className="text-sm whitespace-pre-wrap leading-relaxed my-3">
            {parseInline(line)}
          </p>
        );
      }
    }
  });

  flushList(); // Flush any remaining list items at the end of the text

  if (elements.length === 0 && text) {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed">{parseInline(text)}</p>;
  }

  // The outer div is needed to return a single element.
  return <div>{elements}</div>;
};


// This function parses the message text and splits it into text and code segments.
const parseMessage = (text: string) => {
  // Regex to find code blocks and capture them, including the fences
  const parts = text.split(/(```[\w\s]*\n[\s\S]*?\n```)/g);
  
  const segments = parts.map((part, index) => {
    // Check if the part is a code block
    const match = part.match(/```(\w*)\n([\s\S]*?)\n```/);
    if (match) {
      const language = match[1] || '';
      const code = match[2];
      // Return a code segment object if it's a valid code block
      return { type: 'code', content: code, language, key: `code-${index}` };
    }
    // If it's not a code block, treat it as text, but only if it's not empty/whitespace
    if (part.trim()) {
       return { type: 'text', content: part, key: `text-${index}` };
    }
    return null;
  }).filter(Boolean); // Filter out any null entries (from empty splits)

  // If no segments are found (e.g., empty message), return a single empty text segment
  if (segments.length === 0) {
    return [{ type: 'text', content: '', key: 'empty-text' }];
  }
  
  return segments;
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  // For the bot, parse the message. For the user, it's always just plain text.
  const messageSegments = !isUser ? parseMessage(message.text) : [{ type: 'text', content: message.text, key: message.id }];

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <BotAvatar />
        </div>
      )}
      
      {isUser ? (
        // User Message Bubble
        <div
          className={`max-w-[85%] sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 rounded-br-none text-white`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      ) : (
        // Bot Message Bubble - New Design with Code Block support
        <div className="max-w-[85%] sm:max-w-md lg:max-w-lg w-full">
            <div className="rounded-2xl rounded-bl-none shadow-lg bg-gradient-to-br from-cyan-500/40 via-cyan-500/10 to-transparent p-[1px]">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#24243e] dark:to-[#1a1a2e] px-4 py-3 rounded-[15px] rounded-bl-none text-gray-800 dark:text-gray-100">
                    {messageSegments.map((segment) => {
                        if (segment.type === 'code') {
                            return <CodeBlock key={segment.key} code={segment.content} language={segment.language} />;
                        }
                        return <FormattedText key={segment.key} text={segment.content} />;
                    })}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;