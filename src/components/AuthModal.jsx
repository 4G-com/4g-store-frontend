import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { X, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// أيقونة Google SVG
const GoogleIcon = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.04 0 3.5.83 4.37 1.62l2.33-2.33C18.4.56 15.75 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.25 0 12.07-4.73 12.07-12.07 0-.81-.07-1.61-.2-2.39H12.48z"/>
  </svg>
  );

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', username: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('signIn');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });
    if (error) {
      setErrors({ login: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    } else if (data.user) {
      onLogin(data.user);
      onClose();
    }
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage('');
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: { data: { username: signupData.username } }
    });
    if (error) {
      setErrors({ signup: error.message.includes("User already registered") ? 'هذا البريد الإلكتروني مسجل بالفعل.' : 'حدث خطأ أثناء إنشاء الحساب.' });
    } else if (data.user) {
      setMessage('تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(loginData.email, {
      // ▼▼▼ هذا هو السطر الذي تم تعديله ▼▼▼
      redirectTo: window.location.href.split('#')[0].replace(/\/$/, '') + '/update-password',
    });
    if (error) {
      setErrors({ forgot: 'حدث خطأ ما. يرجى التأكد من البريد الإلكتروني والمحاولة مرة أخرى.' });
    } else {
      setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق منه.');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {view === 'forgotPassword' ? 'إعادة تعيين كلمة المرور' : 'تسجيل الدخول / إنشاء حساب'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {view === 'forgotPassword' ? (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle>هل نسيت كلمة المرور؟</CardTitle>
                <CardDescription>لا تقلق. أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيينها.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-forgot">البريد الإلكتروني المسجل</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="email-forgot" type="email" placeholder="أدخل بريدك الإلكتروني" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="pr-10" required />
                    </div>
                  </div>
                  {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{message}</div>}
                  {errors.forgot && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.forgot}</div>}
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}</Button>
                  <Button variant="link" className="w-full" onClick={() => { setView('signIn'); setMessage(''); setErrors({}); }}>
                    <ArrowRight className="w-4 h-4 ml-2" />
                    العودة إلى تسجيل الدخول
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button variant="outline" className="w-full mb-4" onClick={handleGoogleLogin}>
                <GoogleIcon className="w-4 h-4 ml-2" />
                تسجيل الدخول باستخدام Google
              </Button>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">أو أكمل باستخدام البريد الإلكتروني</span></div>
              </div>
              <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setView(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signIn">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="signUp">إنشاء حساب</TabsTrigger>
                </TabsList>
                <TabsContent value="signIn">
                  <Card className="border-0 shadow-none">
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
                            <Input id="email-login" type="email" placeholder="أدخل بريدك الإلكتروني" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="pr-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-login">كلمة المرور</Label>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="password-login" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة المرور" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="pr-10 pl-10" required />
                            <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </Button>
                          </div>
                          <div className="text-right">
                            <Button type="button" variant="link" className="h-auto p-0 text-xs text-blue-600" onClick={() => { setView('forgotPassword'); setMessage(''); setErrors({}); }}>
                              هل نسيت كلمة السر؟
                            </Button>
                          </div>
                        </div>
                        {errors.login && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.login}</div>}
                        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="signUp">
                  <Card className="border-0 shadow-none">
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
                            <Input id="username-signup" type="text" placeholder="أدخل اسم المستخدم" value={signupData.username} onChange={(e) => setSignupData({ ...signupData, username: e.target.value })} className="pr-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-signup">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="email-signup" type="email" placeholder="أدخل البريد الإلكتروني" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} className="pr-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-signup">كلمة المرور</Label>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة مرور قوية" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} className="pr-10 pl-10" required />
                            <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </Button>
                          </div>
                        </div>
                        {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{message}</div>}
                        {errors.signup && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.signup}</div>}
                        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
