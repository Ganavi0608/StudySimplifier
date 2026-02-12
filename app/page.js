'use client';

import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useStore } from './store/useStore';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';



export default function Home() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowLogin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (showLogin) {
    return <Login onLogin={() => {}} />;
  }

  return <Landing onGetStarted={() => setShowLogin(true)} />;
}
