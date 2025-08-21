import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { X, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';

const CartModal = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, totalPrice }) => {
  if (!isOpen) return null;

  const handleCheckout = () => {
    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <ShoppingCart className="w-5 h-5 ml-2" />
            سلة التسوق
          </h2>
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
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                سلة التسوق فارغة
              </h3>
              <p className="text-gray-400 mb-6">
                أضف بعض المنتجات لتبدأ التسوق
              </p>
              <Button onClick={onClose} variant="outline">
                تصفح المنتجات
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            {item.price} ريال
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            للوحدة الواحدة
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-gray-800">
                            {item.price * item.quantity} ريال
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs p-0 h-auto"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Order Summary */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{totalPrice} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الشحن:</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>المجموع الكلي:</span>
                      <span className="text-green-600">{totalPrice} ريال</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  إتمام الطلب
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  متابعة التسوق
                </Button>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  معلومات الدفع
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• الدفع عند الاستلام متاح</li>
                  <li>• التحويل البنكي مقبول</li>
                  <li>• الشحن مجاني لجميع المناطق</li>
                  <li>• سيتم التواصل معك لتأكيد الطلب</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

