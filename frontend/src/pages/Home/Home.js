// home.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, Truck, ShieldCheck, Clock, Leaf, Home as HomeIcon, Grid, Tag } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function importAll(r) { let images = {}; r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); }); return images; } const images = importAll(require.context('../../assets', false, /\.(png|jpe?g|svg)$/));

// ==========================================
// 1. DUMMY DATA
// ==========================================
const categories = [
  { id: 1, name: "Snacks", icon: "🥨" },
  { id: 2, name: "Mixed Nuts", icon: "🥜" },
  { id: 3, name: "Health Products", icon: "💊" },
  { id: 4, name: "Beverages", icon: "🧃" },
  { id: 5, name: "Dairy Products", icon: "🥛" },
  { id: 6, name: "Grocery", icon: "🌾" },
  { id: 7, name: "Pooja Needs", icon: "🪔" },
];

const products = [
  { id: 101, name: "Aashirvaad Whole Wheat Atta", price: 210, originalPrice: 250, image: "AashirvaadWholeWheatAtta.jpg", category: "Grocery" },
  { id: 102, name: "Amul Taaza Toned Milk (1L)", price: 70, originalPrice: 70, image: "AmulTaazaTonedMilk.png", category: "Dairy Products" },
  { id: 103, name: "Haldiram's Bhujia Sev", price: 110, originalPrice: 120, image: "bhujia_sev_haldiram.jpg", category: "Snacks" },
  { id: 104, name: "Premium California Almonds", price: 450, originalPrice: 600, image: "premium_california_almond.jpg", category: "Mixed Nuts" },
  { id: 101, name: "Aashirvaad Whole Wheat Atta", price: 210, originalPrice: 250, image: "AashirvaadWholeWheatAtta.jpg", category: "Grocery" },
  { id: 102, name: "Amul Taaza Toned Milk (1L)", price: 70, originalPrice: 70, image: "AmulTaazaTonedMilk.png", category: "Dairy Products" },
  { id: 103, name: "Haldiram's Bhujia Sev", price: 110, originalPrice: 120, image: "bhujia_sev_haldiram.jpg", category: "Snacks" },
  { id: 104, name: "Premium California Almonds", price: 450, originalPrice: 600, image: "premium_california_almond.jpg", category: "Mixed Nuts" },
];

// ==========================================
// 2. CART CONTEXT (State Management)
// ==========================================


const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, increaseQty, decreaseQty, removeItem, totalAmount } = useCart();

  const navigate = useNavigate();

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-all duration-300 ease-in-out z-50`}>

      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">Your Cart</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[70%]">
        {cart.length === 0 && <p className="text-gray-500">Cart is empty</p>}

        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 items-center border-b pb-3">
            <img src={images[item.image]} className="w-12 h-12 object-contain" />

            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-green-600 font-bold">₹{item.price}</p>

              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => decreaseQty(item.id)} className="px-2 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)} className="px-2 bg-gray-200 rounded">+</button>
              </div>
            </div>

            <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <h3 className="font-bold text-lg">Total: ₹{totalAmount}</h3>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { cartCount } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-green-100">
        

        {/* OVERLAY */}
        {isMobileMenuOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-lg 
  transform transition-all duration-300 ease-in-out 
  ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg text-green-700">
              Balaji<span className="text-orange-500">Traders</span>
            </h2>

            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col p-4 space-y-5">

            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 ${location.pathname === "/" ? "text-green-600 font-semibold" : "text-gray-700"
                }`}
            >
              <HomeIcon className="w-5 h-5" />
              Home
            </a>

            <a
              href="#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 ${location.hash === "#categories" ? "text-green-600 font-semibold" : "text-gray-700"
                }`}
            >
              <Grid className="w-5 h-5" />
              Categories
            </a>

            <a
              href="#offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 ${location.hash === "#offers" ? "text-green-600 font-semibold" : "text-gray-700"
                }`}
            >
              <Tag className="w-5 h-5" />
              Offers
            </a>

            <button className="flex items-center gap-3 text-gray-700">
              <User className="w-5 h-5" />
              Profile
            </button>

          </div>
        </div>

        <div className="container mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-green-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-green-700 tracking-tight">
              Balaji<span className="text-orange-500">Traders</span>
            </h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for groceries..."
              className="w-full bg-gray-100 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">

            {/* Links */}
            <div className="hidden md:flex gap-4 text-gray-600 font-medium">
              <a href="#home" className="hover:text-green-600 transition">Home</a>
              <a href="#categories" className="hover:text-green-600 transition">Categories</a>
              <a href="#offers" className="hover:text-green-600 transition">Offers</a>
            </div>

            {/* User */}
            <button className="text-gray-600 hover:text-green-600 transition hidden sm:block">
              <User className="w-6 h-6" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setOpenCart(true)}
              className="relative text-gray-600 hover:text-green-600 transition"
            >
              <ShoppingCart id="cart-icon" className="w-6 h-6" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
};

const Hero = () => (
  <div className="bg-green-50 py-12 md:py-20 px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
      Fresh Groceries, <span className="text-green-600">Delivered in Minutes.</span>
    </h1>
    <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">Your trusted local Kirana store is now online. Get fresh produce, daily essentials, and more at your doorstep.</p>
    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
      Shop Now
    </button>
  </div>
);

const Categories = () => (
  <section id="categories" className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 border border-transparent hover:border-green-200"
          >
            <span className="text-4xl mb-2">{cat.icon}</span>
            <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = ({ searchTerm }) => {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const scrollRef = useRef(null);

  const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Near You</h2>
      <div className="relative">

        {/* LEFT BUTTON */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
        >
          ◀
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth snap-x"
        >
          {filteredProducts.map((product, index) => {
            const cartItem = cart.find((item) => item.id === product.id);

            return (
              <div
                key={`${product.id}-${index}`}
                className="min-w-[180px] md:min-w-[220px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col group snap-start"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  {product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  <img
                    src={images[product.image] || product.image}
                    alt={product.name}
                    className="w-full h-40 object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <span className="text-xs text-green-600 font-semibold mb-1">
                  {product.category}
                </span>
                <h3 className="font-medium text-gray-800 text-sm md:text-base mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ NEW BUTTON / CONTROLS */}
                {cartItem ? (
                  <div className="flex items-center justify-between mt-4 bg-green-100 rounded-lg px-3 py-1">
                    <button
                      onClick={() => decreaseQty(product.id)}
                      className="text-lg font-bold px-2"
                    >
                      −
                    </button>

                    <span className="font-semibold">{cartItem.quantity}</span>

                    <button
                      onClick={() => increaseQty(product.id)}
                      className="text-lg font-bold px-2"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 font-medium py-2 rounded-lg"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
        >
          ▶
        </button>
      </div>
    </section>
  );
};

const Offers = () => (
  <section id="offers" className="py-8 container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-orange-100 rounded-2xl p-6 flex flex-col justify-center items-start">
        <span className="text-orange-600 font-bold mb-2">Limited Time</span>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Get 20% Off on Snacks</h3>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Claim Offer</button>
      </div>
      <div className="bg-blue-100 rounded-2xl p-6 flex flex-col justify-center items-start">
        <span className="text-blue-600 font-bold mb-2">New Arrival</span>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Fresh Dairy Products</h3>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Explore Now</button>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: <Clock className="w-8 h-8 text-green-600" />, title: "Fast Delivery", desc: "Under 30 minutes" },
    { icon: <Leaf className="w-8 h-8 text-green-600" />, title: "Fresh Products", desc: "Sourced daily" },
    { icon: <ShieldCheck className="w-8 h-8 text-green-600" />, title: "Trusted Local Store", desc: "Serving for 10+ years" },
    { icon: <Truck className="w-8 h-8 text-green-600" />, title: "Free Shipping", desc: "Orders above ₹500" },
  ];
  return (
    <section className="py-12 border-t border-gray-100 mt-8 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">{f.icon}</div>
            <h4 className="font-bold text-gray-800">{f.title}</h4>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Balaji<span className="text-orange-500">Traders</span></h2>
      <p className="mb-6">Your friendly neighborhood grocery store, now online.</p>
      <div className="flex justify-center flex-wrap gap-6 mb-8 text-sm">
        <a href="/about" className="hover:text-white transition-colors">About Us</a>
        <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
      </div>
      <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} BalajiTraders. All rights reserved.</p>
    </div>
  </footer>
);

// ==========================================
// 4. MAIN EXPORT COMPONENT
// ==========================================
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="min-h-screen font-sans bg-white selection:bg-green-200">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts searchTerm={searchTerm} />
        <Offers />
        <Features />
      </main>
      <Footer />
    </div>
  );
}