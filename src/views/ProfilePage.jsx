// src/views/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Wallet, Edit, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, wallet_balance')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
          setUsername(data.username || '');
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) {
        alert('حدث خطأ أثناء تحديث الملف الشخصي.');
        console.error(error);
      } else {
        setProfile({ ...profile, username });
        setIsEditing(false);
        alert('تم تحديث الملف الشخصي بنجاح!');
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري تحميل الملف الشخصي...</div>;
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="mb-4">لم يتم العثور على الملف الشخصي. قد تحتاج إلى تسجيل الخروج ثم الدخول مرة أخرى.</p>
        <Link to="/">
          <Button>العودة إلى الصفحة الرئيسية</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">الملف الشخصي</CardTitle>
          <CardDescription className="text-center text-lg">
            أدر معلومات حسابك ورصيد محفظتك من هنا.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* قسم المحفظة */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-center shadow-md">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-semibold">رصيد المحفظة</h3>
            </div>
            <p className="text-4xl font-bold tracking-tight">
              {profile.wallet_balance.toFixed(2)} ريال
            </p>
            <p className="text-sm opacity-80 mt-1">هذا هو رصيدك الحالي القابل للاستخدام في المتجر.</p>
          </div>

          {/* قسم معلومات المستخدم */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg font-medium flex items-center">
                <User className="w-5 h-5 mr-2" />
                اسم المستخدم
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing || loading}
                  className="text-lg"
                />
                {!isEditing ? (
                  <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setUsername(profile.username || ''); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="text-center pt-4">
              <Link to="/">
                <Button variant="link">العودة إلى الصفحة الرئيسية</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
