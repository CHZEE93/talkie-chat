import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatTimestamp } from '@/lib/messages';
import { User } from '@/types';

interface MessageItemProps {
  message: {
    id: string;
    userId: string;
    text: string;
    createdAt: any;
  };
  isMyMessage: boolean;
}

export default function MessageItem({ message, isMyMessage }: MessageItemProps) {
  const [sender, setSender] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', message.userId));
        if (userDoc.exists()) {
          setSender(userDoc.data() as User);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [message.userId]);

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
        {!isMyMessage && sender && (
          <div className="flex flex-col items-center mx-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: sender.color }}
            >
              {sender.displayName[0].toUpperCase()}
            </div>
          </div>
        )}
        <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
          {!isMyMessage && sender && (
            <span className="text-sm text-gray-600 mb-1">{sender.displayName}</span>
          )}
          <div className="flex items-end gap-2">
            {!isMyMessage && <div className="w-2" />}
            <div
              className={`px-4 py-2 rounded-2xl max-w-sm break-words ${
                isMyMessage
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
            <span className="text-xs text-gray-500 min-w-[4.5rem]">
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 