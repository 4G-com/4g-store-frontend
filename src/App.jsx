// src/App.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // ★ 1. استيراد مكونات الراوتر

// استيراد الصفحات والمكونات
import HomePage from './views/HomePage'; // ★ 2. سننشئ هذا المكون لاحقًا
import UpdatePasswordPage from './views/UpdatePasswordPage';
import ProfilePage from './views/ProfilePage'; // ★ 3. استيراد صفحة الملف الشخصي
import AuthModal from './components/AuthModal';

// استيراد مكونات واجهة المستخدم من ShadCN
import { Button } from '@/components/ui/button.jsx';
import { Wifi, User, LogOut, UserCog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/'); // العودة للرئيسية بعد تسجيل الخروج
  };

  return (
    <>
      {/* Header - سيظهر في كل الصفحات */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">متجر 4G</h1>
                <p className="text-sm text-gray-600">بطاقات الإنترنت عالية الجودة</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                // ★ 4. قائمة منسدلة للمستخدم المسجل دخوله
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                       <User className="w-5 h-5" />
                       <span>{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ★ 5. نظام المسارات (Routes) لعرض الصفحات المختلفة */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* نافذة تسجيل الدخول (Modal) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default App;
