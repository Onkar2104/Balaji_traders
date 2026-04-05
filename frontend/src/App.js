import { CartProvider } from "./context/CartContext"; // (you should move it here ideally)
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import CheckoutPage from "./pages/Cart/CheckoutPage";
import ReactGA from "react-ga4";

ReactGA.initialize("G-8R10Y8Q7JY"); // replace with your ID

function App() {
  return (
    <CartProvider>   {/* ✅ GLOBAL */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;