// src/views/HomePage.jsx

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ShoppingCart, Wifi, Phone, ArrowLeft, Zap, ShieldCheck, Code, MessageCircle, Mail, PhoneCall, Repeat } from 'lucide-react';
import CartModal from '../components/CartModal';
import '../App.css';

// --- بيانات المنتجات (تبقى كما هي) ---
const internetPackages = [
  { id: 101, name: "باقة 100 ميجا", data: "100 MB", duration: "24 ساعة", validity: "يوم", price: 500 },
  { id: 102, name: "باقة 500 ميجا", data: "500 MB", duration: "72 ساعة", validity: "3 أيام", price: 1500 },
  { id: 103, name: "باقة 1 جيجا", data: "1 GB", duration: "اسبوع", validity: "أسبوع", price: 2500 },
  { id: 104, name: "باقة 5 جيجا", data: "5 GB", duration: "شهر", validity: "شهر", price: 5000 },
  { id: 105, name: "باقة 10 جيجا", data: "10 GB", duration: "شهر", validity: "شهر", price: 8000 },
  { id: 106, name: "باقة يومين", data: "750 MB", duration: "48 ساعة", validity: "يومين", price: 2000 },
];
const telecomCompanies = [
  { id: 'yemen-mobile', name: "يمن موبايل" },
  { id: 'sabafon', name: "سبأفون" },
  { id: 'you', name: "YOU" },
  { id: 'mtn', name: "MTN" },
];
const rechargeCards = {
  'yemen-mobile': [{ id: 301, name: "شحن يمن موبايل 200 ريال", price: 200 }, { id: 302, name: "شحن يمن موبايل 500 ريال", price: 500 }],
  'sabafon': [{ id: 401, name: "شحن سبأفون 250 ريال", price: 250 }, { id: 402, name: "شحن سبأفون 550 ريال", price: 550 }],
  'you': [{ id: 501, name: "شحن YOU 200 ريال", price: 200 }, { id: 502, name: "شحن YOU 1200 ريال", price: 1200 }],
  'mtn': [{ id: 601, name: "شحن MTN 300 ريال", price: 300 }],
};
const validityFilters = ["الكل", "يوم", "يومين", "أسبوع", "شهر"];


const HomePage = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filteredInternetPackages = useMemo(() => {
    if (activeFilter === 'الكل') return internetPackages;
    return internetPackages.filter(pkg => pkg.validity === activeFilter);
  }, [activeFilter]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) setCartItems(cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    else setCartItems([...cartItems, { ...product, quantity: 1 }]);
  };
  const removeFromCart = (productId) => setCartItems(cartItems.filter(item => item.id !== productId));
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) removeFromCart(productId);
    else setCartItems(cartItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };
  const getTotalPrice = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCurrentView('rechargeCards');
  };

  const handleCheckout = () => {
    const total = getTotalPrice();
    const itemsSummary = cartItems.map(item => `${item.name} (الكمية: ${item.quantity})`).join(', ');
    const message = `طلب جديد!\n\nالمنتجات: ${itemsSummary}\n\nالإجمالي: ${total} ريال يمني`;
    const whatsappUrl = `https://wa.me/967774235220?text=${encodeURIComponent(message )}`;
    window.open(whatsappUrl, '_blank');
    setIsCartModalOpen(false);
  };


  const renderContent = () => {
    if (currentView === 'internet') {
        return (
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <Button variant="ghost" onClick={() => setCurrentView('home')} className="mb-8 text-slate-600 hover:bg-slate-200">
                <ArrowLeft className="w-4 h-4 ml-2" /> العودة للأقسام
              </Button>
              <h3 className="text-3xl font-bold text-slate-800 mb-4 text-center">باقات انترنت 4G عالية السرعة</h3>
              <p className="text-center text-slate-500 mb-10">اختر الباقة التي تناسب استهلاكك اليومي، الأسبوعي، أو الشهري.</p>
              <div className="flex justify-center mb-12 overflow-x-auto py-2">
                <div className="inline-flex bg-slate-200 rounded-lg p-1 space-x-1">
                  {validityFilters.map(filter => (
                    <Button key={filter} variant={activeFilter === filter ? 'default' : 'ghost'} onClick={() => setActiveFilter(filter)} className="transition-all data-[state=active]:bg-sky-600 data-[state=active]:text-white">{filter}</Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInternetPackages.map((pkg) => (
                  <Card key={pkg.id} className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardHeader><CardTitle className="text-slate-800">{pkg.name}</CardTitle></CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <p className="text-slate-600"><strong>حجم البيانات:</strong> {pkg.data}</p>
                      <p className="text-slate-600"><strong>الصلاحية:</strong> {pkg.validity}</p>
                      <p className="text-2xl font-bold text-emerald-600">{pkg.price.toLocaleString()} ريال</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                       <Button onClick={() => addToCart(pkg)} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                         <ShoppingCart className="w-4 h-4 ml-2" /> أضف للسلة
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );
      }
  
      if (currentView === 'rechargeCompanies') {
        return (
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <Button variant="ghost" onClick={() => setCurrentView('home')} className="mb-8 text-slate-600 hover:bg-slate-200">
                <ArrowLeft className="w-4 h-4 ml-2" /> العودة للأقسام
              </Button>
              <h3 className="text-3xl font-bold text-slate-800 mb-12 text-center">اختر شركة الاتصالات</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {telecomCompanies.map((company) => (
                      <Card key={company.id} onClick={() => handleCompanySelect(company)} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                          <h4 className="text-xl font-semibold text-slate-700 mt-4">{company.name}</h4>
                      </Card>
                  ))}
               </div>
            </div>
          </section>
        );
      }
  
      if (currentView === 'rechargeCards' && selectedCompany) {
          const cards = rechargeCards[selectedCompany.id] || [];
          return (
              <section className="py-12 bg-slate-50">
                  <div className="container mx-auto px-4">
                      <Button variant="ghost" onClick={() => setCurrentView('rechargeCompanies')} className="mb-8 text-slate-600 hover:bg-slate-200">
                          <ArrowLeft className="w-4 h-4 ml-2" /> العودة للشركات
                      </Button>
                      <h3 className="text-3xl font-bold text-slate-800 mb-12 text-center">بطاقات شحن {selectedCompany.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {cards.map((card) => (
                              <Card key={card.id} className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                                  <CardHeader><CardTitle className="text-slate-800">{card.name}</CardTitle></CardHeader>
                                  <CardContent className="flex-grow">
                                      <p className="text-2xl font-bold text-emerald-600">{card.price.toLocaleString()} ريال</p>
                                  </CardContent>
                                  <div className="p-6 pt-0">
                                      <Button onClick={() => addToCart(card)} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                                        <ShoppingCart className="w-4 h-4 ml-2" /> أضف للسلة
                                      </Button>
                                  </div>
                              </Card>
                          ))}
                      </div>
                  </div>
              </section>
          );
      }

    // العرض الرئيسي (الصفحة الرئيسية الجديدة)
    return (
      <>
        {/* قسم البطل (Hero Section) */}
        <section className="relative bg-cover bg-center text-white" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554435493-93422e8220c8?q=80&w=2070&auto=format&fit=crop' )"}}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-sky-900/30"></div>
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-20 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">4G: سرعة تتجاوز الخيال</h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">انطلق في عالم الإنترنت بسرعة البرق مع باقاتنا المصممة لتلبية كل احتياجاتك.</p>
            </div>
        </section>

        {/* ★★★ قسم التحليلات المصغر والأفقي ★★★ */}
        <div className="bg-slate-50 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                        <Zap className="w-6 h-6 text-yellow-500 mr-3" />
                        <div>
                            <h4 className="font-bold text-slate-800">تسليم فوري</h4>
                            <p className="text-sm text-slate-500">أكوادك في ثوانٍ</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-green-500 mr-3" />
                        <div>
                            <h4 className="font-bold text-slate-800">آمن وموثوق</h4>
                            <p className="text-sm text-slate-500">رضا العملاء أولويتنا</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                        <Code className="w-6 h-6 text-sky-500 mr-3" />
                        <div>
                            <h4 className="font-bold text-slate-800">دعم فني</h4>
                            <p className="text-sm text-slate-500">متواجدون للمساعدة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* شريط تمرير الأقسام */}
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-4 text-slate-800">تصفح جميع أقسامنا</h3>
                <p className="text-center text-slate-500 mb-10">كل ما تحتاجه من خدمات الاتصالات والإنترنت في مكان واحد.</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                    <div onClick={() => setCurrentView('internet')} className="flex-1 bg-sky-100 text-sky-800 rounded-xl p-8 text-center cursor-pointer hover:bg-sky-200 transition-colors duration-300 transform hover:scale-105">
                        <Wifi className="w-12 h-12 mx-auto mb-4" />
                        <h4 className="font-bold text-xl">باقات انترنت 4G</h4>
                    </div>
                    <div onClick={() => setCurrentView('rechargeCompanies')} className="flex-1 bg-emerald-100 text-emerald-800 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-200 transition-colors duration-300 transform hover:scale-105">
                        <Phone className="w-12 h-12 mx-auto mb-4" />
                        <h4 className="font-bold text-xl">بطاقات شحن رصيد</h4>
                    </div>
                </div>
            </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-sky-600 cursor-pointer" onClick={() => setCurrentView('home')}>متجر 4G</h1>
            <Button variant="outline" onClick={() => setIsCartModalOpen(true)} className="relative border-slate-300 text-slate-700 hover:bg-slate-100">
              <ShoppingCart className="w-4 h-4 ml-2" /> السلة
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{getTotalItems()}</Badge>
              )}
            </Button>
        </div>
      </header>
      
      <main>{renderContent()}</main>

      {/* ★★★ القائمة السفلية الجديدة والمعدلة ★★★ */}
      <footer className="bg-slate-800 text-slate-300 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold text-white mb-3">متجر 4G</h4>
              <p className="text-sm text-slate-400">وجهتك الأولى للحصول على بطاقات الإنترنت والشحن في اليمن. سرعة، ثقة، وأمان.</p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">روابط مهمة</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-sky-400 cursor-pointer flex items-center transition-colors"><ShieldCheck className="w-4 h-4 ml-2"/>سياسة الخصوصية</li>
                <li className="hover:text-sky-400 cursor-pointer flex items-center transition-colors"><Repeat className="w-4 h-4 ml-2"/>سياسة الاستبدال</li>
                <li className="hover:text-sky-400 cursor-pointer flex items-center transition-colors"><Code className="w-4 h-4 ml-2"/>سياسة تسليم الأكواد</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">تواصل معنا</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <a href="https://wa.me/967774235220" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center transition-colors">
                    <PhoneCall className="w-4 h-4 ml-2 text-green-400"/>واتساب المتجر
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="mailto:hr330hr@gmail.com" className="hover:text-sky-400 flex items-center transition-colors">
                    <Mail className="w-4 h-4 ml-2 text-blue-400"/>hr330hr@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">تصميم وتطوير</h4>
              <p className="text-sm text-slate-400 mb-2">وهيب</p>
              <a href="https://wa.me/966550079940" target="_blank" rel="noopener noreferrer">
                 <Button variant="outline" className="w-full border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white text-xs">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    تواصل مع المطور
                 </Button>
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
            <p>&copy; 2025 متجر 4G. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={( ) => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default HomePage;
