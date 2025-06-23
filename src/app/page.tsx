'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import AuthForm from '@/components/auth/AuthForm';
import ChatContainer from '@/components/chat/ChatContainer';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Toaster position="top-center" />
      {!user ? <AuthForm /> : <ChatContainer />}
    </main>
  );
}
