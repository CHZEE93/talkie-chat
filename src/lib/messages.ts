import { addDoc, collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Message } from '@/types';

export const sendMessage = async (userId: string, text: string) => {
  try {
    await addDoc(collection(db, 'messages'), {
      userId,
      text,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessagesQuery = () => {
  return query(
    collection(db, 'messages'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
};

export const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '어제 ' + date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}; 