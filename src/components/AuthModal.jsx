import React, { useState } from 'react';
// ★★★ استيراد العميل الذي أنشأناه ★★★
import { supabase } from '../supabaseClient'; 
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { X, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    username: '', 
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ★★★ دالة تسجيل الدخول باستخدام Supabase ★★★
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      setErrors({ login: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    } else if (data.user) {
      onLogin(data.user);
      onClose();
      setLoginData({ email: '', password: '' });
    }
    setIsLoading(false);
  };

  // ★★★ دالة إنشاء الحساب باستخدام Supabase ★★★
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: { 
          username: signupData.username,
          phone: signupData.phone,
        }
      }
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        setErrors({ signup: 'هذا البريد الإلكتروني مسجل بالفعل.' });
      } else {
        setErrors({ signup: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' });
      }
    } else if (data.user) {
      alert('تم إنشاء حسابك بنجاح! سيتم تسجيل دخولك.');
      onLogin(data.user);
      onClose();
      setSignupData({ email: '', password: '', username: '', phone: '' });
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">تسجيل الدخول / إنشاء حساب</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>تسجيل الدخول</CardTitle>
                  <CardDescription>أدخل بريدك الإلكتروني وكلمة المرور</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="email-login" type="email" placeholder="أدخل بريدك الإلكتروني" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="pr-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-login">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="password-login" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة المرور" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="pr-10 pl-10" required />
                        <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    {errors.login && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.login}</div>}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>إنشاء حساب جديد</CardTitle>
                  <CardDescription>املأ البيانات التالية لإنشاء حساب جديد</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username-signup">اسم المستخدم (اختياري)</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="username-signup" type="text" placeholder="أدخل اسم المستخدم" value={signupData.username} onChange={(e) => setSignupData({...signupData, username: e.target.value})} className="pr-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-signup">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="email-signup" type="email" placeholder="أدخل البريد الإلكتروني" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} className="pr-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-signup">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة مرور قوية" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} className="pr-10 pl-10" required />
                        <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    {errors.signup && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.signup}</div>}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
