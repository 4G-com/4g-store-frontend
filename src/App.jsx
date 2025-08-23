// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // ★★★ استيراد الراوتر
import { supabase } from './supabaseClient';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ShoppingCart, User, Wifi, Smartphone, Globe, Zap } from 'lucide-react';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import UpdatePasswordPage from './views/UpdatePasswordPage'; // ★★★ التأكد من استيراد الصفحة من مجلد views
import './App.css';

// المكون الجديد للصفحة الرئيسية
const HomePage = ({ user, onLogout, onOpenAuthModal, onOpenCartModal, cartItems, addToCart }) => {
  const products = [
    { id: 1, name: "بطاقة إنترنت 50 جيجا", price: 25, originalPrice: 35, description: "بطاقة إنترنت عالية السرعة صالحة لمدة 30 يوم", icon: <Wifi className="w-8 h-8" />, features: ["سرعة عالية", "تغطية ممتازة", "صالحة 30 يوم"] },
    { id: 2, name: "بطاقة إنترنت 100 جيجا", price: 45, originalPrice: 60, description: "بطاقة إنترنت فائقة السرعة صالحة لمدة 30 يوم", icon: <Smartphone className="w-8 h-8" />, features: ["سرعة فائقة", "تغطية شاملة", "صالحة 30 يوم"] },
    { id: 3, name: "بطاقة إنترنت 200 جيجا", price: 80, originalPrice: 100, description: "بطاقة إنترنت لا محدودة تقريباً صالحة لمدة 30 يوم", icon: <Globe className="w-8 h-8" />, features: ["سرعة خارقة", "تغطية كاملة", "صالحة 30 يوم"] },
    { id: 4, name: "بطاقة إنترنت 500 جيجا", price: 150, originalPrice: 200, description: "بطاقة إنترنت للاستخدام المكثف صالحة لمدة 30 يوم", icon: <Zap className="w-8 h-8" />, features: ["سرعة البرق", "تغطية متقدمة", "صالحة 30 يوم"] }
  ];

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg"><Wifi className="w-8 h-8 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">متجر 4G</h1>
                <p className="text-sm text-gray-600">بطاقات الإنترنت عالية الجودة</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onOpenCartModal} className="relative">
                <ShoppingCart className="w-4 h-4 ml-2" />
                السلة
                {getTotalItems() > 0 && <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{getTotalItems()}</Badge>}
              </Button>
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={onLogout}>تسجيل الخروج</Button>
                </div>
              ) : (
                <Button variant="default" onClick={onOpenAuthModal}><User className="w-4 h-4 ml-2" />تسجيل الدخول</Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">بطاقات إنترنت عالية الجودة</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">احصل على أفضل بطاقات الإنترنت بأسعار منافسة وسرعات فائقة</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">منتجاتنا المميزة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white w-fit">{product.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-800">{product.name}</CardTitle>
                  <CardDescription className="text-gray-600">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{product.price} ريال</span>
                      <span className="text-lg text-gray-400 line-through">{product.originalPrice} ريال</span>
                    </div>
                    <Badge variant="destructive" className="mt-2">وفر {product.originalPrice - product.price} ريال</Badge>
                  </div>
                  <Button onClick={() => addToCart(product)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"><ShoppingCart className="w-4 h-4 ml-2" />أضف للسلة</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center"><p>&copy; 2024 متجر 4G. جميع الحقوق محفوظة.</p></div>
      </footer>
    </div>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setIsAuthModalOpen(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCartItems(items => items.filter(item => item.id !== productId));
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) removeFromCart(productId);
    else setCartItems(items => items.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };
  const getTotalPrice = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* ★★★ استخدام الراوتر لعرض الصفحات المختلفة ★★★ */}
      <Routes>
        <Route path="/" element={
          <HomePage
            user={user}
            onLogout={handleLogout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCartModal={() => setIsCartModalOpen(true)}
            cartItems={cartItems}
            addToCart={addToCart}
          />
        } />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
      </Routes>

      {/* Modals (تبقى موجودة على مستوى التطبيق) */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
      />
    </>
  );
}

export default App;
