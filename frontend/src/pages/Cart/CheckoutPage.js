// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  ArrowLeft, CheckCircle2, Loader2, MapPin, 
  CreditCard, Banknote, QrCode, Receipt 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

const images = importAll(require.context('../../assets', false, /\.(png|jpe?g|svg)$/));

// ==========================================
// 1. SUB-COMPONENTS
// ==========================================

const CartItemRow = ({ item }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      
      {/* UPDATE THE SRC HERE */}
      <img 
        src={images[item.image] || item.image} 
        alt={item.name} 
        className="w-12 h-12 rounded-lg object-contain p-1 border border-gray-200" 
      />
      {/* ------------------- */}

      <div>
        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
      </div>
    </div>
    <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
  </div>
);

const PaymentOptions = ({ selectedPayment, setSelectedPayment }) => {
  const options = [
    { id: 'cod', label: 'Cash on Delivery', icon: <Banknote className="w-5 h-5 text-green-600" /> },
    { id: 'upi', label: 'UPI / QR', icon: <QrCode className="w-5 h-5 text-green-600" /> },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-gray-400" />, disabled: true },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-green-600" /> Payment Method
      </h3>
      <div className="space-y-3">
        {options.map((opt) => (
          <label 
            key={opt.id} 
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'
            } ${opt.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {opt.icon}
              <span className={`font-medium ${selectedPayment === opt.id ? 'text-green-800' : 'text-gray-700'}`}>
                {opt.label} {opt.disabled && '(Coming Soon)'}
              </span>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value={opt.id}
              checked={selectedPayment === opt.id}
              onChange={() => !opt.disabled && setSelectedPayment(opt.id)}
              disabled={opt.disabled}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

const OrderSuccess = ({ orderDetails, navigate }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div className="bg-green-100 p-4 rounded-full mb-6">
      <CheckCircle2 className="w-16 h-16 text-green-600" />
    </div>
    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
    <p className="text-gray-600 mb-8 max-w-md">
      Thank you, {orderDetails.name.split(' ')[0]}. Your groceries are being packed and will be delivered shortly.
    </p>
    
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-left mb-8">
      <p className="text-sm text-gray-500 mb-1">Order ID</p>
      <p className="font-mono font-medium text-gray-800 mb-4">#KRN-{Math.floor(100000 + Math.random() * 900000)}</p>
      
      <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
      <p className="font-medium text-gray-800 line-clamp-2">{orderDetails.address1}, {orderDetails.city}</p>
    </div>

    <button 
      onClick={() => navigate("/")}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
    >
      Continue Shopping
    </button>
  </div>
);

// ==========================================
// 2. MAIN CHECKOUT PAGE COMPONENT
// ==========================================

export default function CheckoutPage() {

  const navigate = useNavigate();

  const { cart, clearCart } = useCart();
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', 
    address1: '', address2: '', city: '', state: '', pincode: '',
    saveAddress: true
  });

  // Math Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.02; // 2% tax
  const total = subtotal + deliveryFee + tax;

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = () => {
    const required = ['name', 'mobile', 'address1', 'city', 'state', 'pincode'];
    return required.every(field => formData[field].trim() !== '');
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      window.scrollTo(0, 0);
    }, 1500);
  };

  // Render Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <OrderSuccess orderDetails={formData} navigate={navigate} />
      </div>
    );
  }

  // Render Checkout Page
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-xl font-bold text-green-700">Balaji<span className="text-orange-500">Traders</span></h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 max-w-6xl">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <button onClick={() => navigate("/")} className="text-green-600 font-medium hover:underline">
              Go back to shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT SIDE: Form & Payment */}
            <div className="w-full lg:w-2/3">
              <form id="checkout-form" onSubmit={placeOrder}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" /> Delivery Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="John Doe" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <input type="tel" name="mobile" required value={formData.mobile} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="+91 98765 43210" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="john@example.com" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                      <input type="text" name="address1" required value={formData.address1} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="House/Flat No., Building Name" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Street, Sector, Landmark" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Mumbai" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Maharashtra" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="400001" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center">
                    <input type="checkbox" id="saveAddress" name="saveAddress" checked={formData.saveAddress} onChange={handleInputChange} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                    <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-600">Securely save this address for future checkouts</label>
                  </div>
                </div>
              </form>

              <PaymentOptions selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />
            </div>

            {/* RIGHT SIDE: Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-green-600" /> Order Summary
                </h2>
                
                <div className="max-h-60 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                  {cart.map(item => <CartItemRow key={item.id} item={item} />)}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (2%)</span>
                    <span className="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="font-medium text-green-600">Free</span>
                    ) : (
                      <span className="font-medium text-gray-800">₹{deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {deliveryFee > 0 && (
                    <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded text-center mt-2">
                      Add ₹{(500 - subtotal).toFixed(2)} more to get Free Delivery!
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">To Pay</span>
                  <span className="text-2xl font-extrabold text-green-700">₹{Math.round(total)}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isFormValid() 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}