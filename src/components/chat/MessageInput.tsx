import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-4 bg-white border-t">
      <div ref={pickerRef} className="relative">
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaceSmileIcon className="w-6 h-6" />
        </button>
        {showEmoji && (
          <div className="absolute bottom-12 left-0 z-10">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="light"
              locale="ko"
              previewPosition="none"
            />
          </div>
        )}
      </div>
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={1}
          style={{
            minHeight: '40px',
            maxHeight: '120px',
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>
    </form>
  );
} 