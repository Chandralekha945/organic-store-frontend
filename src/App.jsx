import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";

import OwnerDashboard from "./pages/Ownerdashboard";

export default function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSetUser = (u) => {
    setUser(u);

    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const productId = page.startsWith("product-")
    ? parseInt(page.split("-")[1])
    : null;

  const renderPage = () => {
    if (page === "home") return <Home setPage={setPage} />;

    if (page === "products")
      return <Products setPage={setPage} />;

    if (page === "cart")
      return <Cart setPage={setPage} />;

    if (page === "checkout")
      return <Checkout setPage={setPage} user={user} />;

    if (page === "login")
      return (
        <Login
          setUser={handleSetUser}
          setPage={setPage}
        />
      );

    if (page === "wishlist")
      return <Wishlist setPage={setPage} />;

    if (page === "my-orders")
  return <MyOrders user={user} setPage={setPage} />;// if (page === "orders")
    //   return (
    //     <Orders
    //       user={user}
    //       setPage={setPage}
    //     />
    //   );

    if (page === "owner-dashboard")
      return <OwnerDashboard />;

    if (productId)
      return (
        <ProductDetails
          productId={productId}
          setPage={setPage}
        />
      );

    return <Home setPage={setPage} />;
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "#f9fef5",
          }}
        >
          <Navbar
            page={page}
            setPage={setPage}
            user={user}
            setUser={handleSetUser}
          />

          <main style={{ flex: 1 }}>
            {renderPage()}
          </main>

          <Footer setPage={setPage} />

          {/* WhatsApp Floating Button */}
          <a
            href="https://wa.me/919550972999?text=Hello%20I%20need%20help"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#25D366",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 9999,
            }}
          >
            💬
          </a>
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}