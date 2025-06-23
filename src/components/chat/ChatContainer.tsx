import { useEffect, useRef } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getMessagesQuery, sendMessage } from '@/lib/messages';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Message } from '@/types';

export default function ChatContainer() {
  const [user] = useAuthState(auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messagesSnapshot, loading] = useCollection(getMessagesQuery());
  const messages = messagesSnapshot?.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as Message[] | undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!user) return;
    try {
      await sendMessage(user.uid, text);
    } catch (error) {
      toast.error('메시지 전송에 실패했습니다.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-800">Talkie</h1>
        <button
          onClick={handleSignOut}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {messages?.map((message) => (
              <MessageItem
                key={message.id}
                message={message as Message}
                isMyMessage={message.userId === user.uid}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
} 