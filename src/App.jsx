import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ShoppingCart, User, Wifi, Smartphone, Globe, Zap } from 'lucide-react';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // بيانات المنتجات
  const products = [
    {
      id: 1,
      name: "بطاقة إنترنت 50 جيجا",
      price: 25,
      originalPrice: 35,
      description: "بطاقة إنترنت عالية السرعة صالحة لمدة 30 يوم",
      icon: <Wifi className="w-8 h-8" />,
      features: ["سرعة عالية", "تغطية ممتازة", "صالحة 30 يوم"]
    },
    {
      id: 2,
      name: "بطاقة إنترنت 100 جيجا",
      price: 45,
      originalPrice: 60,
      description: "بطاقة إنترنت فائقة السرعة صالحة لمدة 30 يوم",
      icon: <Smartphone className="w-8 h-8" />,
      features: ["سرعة فائقة", "تغطية شاملة", "صالحة 30 يوم"]
    },
    {
      id: 3,
      name: "بطاقة إنترنت 200 جيجا",
      price: 80,
      originalPrice: 100,
      description: "بطاقة إنترنت لا محدودة تقريباً صالحة لمدة 30 يوم",
      icon: <Globe className="w-8 h-8" />,
      features: ["سرعة خارقة", "تغطية كاملة", "صالحة 30 يوم"]
    },
    {
      id: 4,
      name: "بطاقة إنترنت 500 جيجا",
      price: 150,
      originalPrice: 200,
      description: "بطاقة إنترنت للاستخدام المكثف صالحة لمدة 30 يوم",
      icon: <Zap className="w-8 h-8" />,
      features: ["سرعة البرق", "تغطية متقدمة", "صالحة 30 يوم"]
    }
  ];

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">متجر 4G</h1>
                <p className="text-sm text-gray-600">بطاقات الإنترنت عالية الجودة</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 ml-2" />
                السلة
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="w-4 h-4 ml-2" />
                {user ? user.username : 'تسجيل الدخول'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            بطاقات إنترنت عالية الجودة
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            احصل على أفضل بطاقات الإنترنت بأسعار منافسة وسرعات فائقة
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Zap className="w-4 h-4 ml-1 text-yellow-500" />
              سرعة فائقة
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 ml-1 text-blue-500" />
              تغطية شاملة
            </div>
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 ml-1 text-green-500" />
              سهولة الاستخدام
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            منتجاتنا المميزة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white w-fit">
                    {product.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        {product.price} ريال
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice} ريال
                      </span>
                    </div>
                    <Badge variant="destructive" className="mt-2">
                      وفر {product.originalPrice - product.price} ريال
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    أضف للسلة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">متجر 4G</h4>
              <p className="text-gray-300">
                نوفر أفضل بطاقات الإنترنت عالية الجودة بأسعار منافسة
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-300">
                <li>الرئيسية</li>
                <li>المنتجات</li>
                <li>من نحن</li>
                <li>اتصل بنا</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-gray-300">
                <p>البريد الإلكتروني: info@4g-store.com</p>
                <p>الهاتف: +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 متجر 4G. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={setUser}
      />
      
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
      />
    </div>
  );
}

export default App;

