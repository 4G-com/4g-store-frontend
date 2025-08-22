import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { X, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

// ★★★ الخطوة 1: إضافة مستخدم وهمي للتحقق منه ★★★
// هذا يمثل مستخدمًا مسجلاً في قاعدة بياناتك (بشكل مؤقت)
const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123' // كلمة المرور التي يجب إدخالها
};


const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ★★★ الخطوة 2: تعديل دالة تسجيل الدخول بالكامل ★★★
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // محاكاة استدعاء API للتحقق
    await new Promise(resolve => setTimeout(resolve, 1000));

    // التحقق من صحة البيانات المدخلة مقابل المستخدم الوهمي
    if (
      (loginData.identifier === mockUser.email || loginData.identifier === mockUser.username) &&
      loginData.password === mockUser.password
    ) {
      // نجاح: البيانات متطابقة
      const userToLogin = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email
      };
      onLogin(userToLogin);
      onClose();
      setLoginData({ identifier: '', password: '' });
    } else {
      // فشل: البيانات غير متطابقة
      setErrors({ login: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!signupData.username) newErrors.username = 'اسم المستخدم مطلوب';
    if (!signupData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!signupData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!signupData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: Date.now(), // استخدام timestamp لإنشاء ID فريد مؤقت
        username: signupData.username,
        email: signupData.email
      };
      
      console.log("تم إنشاء حساب جديد (محاكاة):", user);
      alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول بالبيانات الجديدة (هذه الميزة للمحاكاة فقط).");

      onLogin(user);
      onClose();
      setSignupData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ signup: 'خطأ في إنشاء الحساب. حاول مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">تسجيل الدخول / إنشاء حساب</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
                  <CardDescription>
                    أدخل بياناتك للدخول إلى حسابك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier">البريد الإلكتروني أو اسم المستخدم</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="identifier"
                          type="text"
                          placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                          value={loginData.identifier}
                          onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                          className="pr-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="أدخل كلمة المرور"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="pr-10 pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {errors.login && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {errors.login}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>إنشاء حساب جديد</CardTitle>
                  <CardDescription>
                    املأ البيانات التالية لإنشاء حساب جديد
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">اسم المستخدم</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="أدخل اسم المستخدم"
                          value={signupData.username}
                          onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                          className="pr-10"
                          required
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="أدخل البريد الإلكتروني"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          className="pr-10"
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="أدخل رقم الهاتف"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          className="pr-10"
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="أدخل كلمة المرور"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          className="pr-10 pl-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="أعد إدخال كلمة المرور"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          className="pr-10"
                          required
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {errors.signup && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {errors.signup}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </Button>
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
