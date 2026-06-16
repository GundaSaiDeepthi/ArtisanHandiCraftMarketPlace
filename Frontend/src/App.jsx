import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import MyOrders from "./pages/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanOrders from "./pages/artisan/ArtisanOrders";
import MyProducts from "./pages/artisan/MyProducts";
import AddProduct from "./pages/artisan/AddProduct";
import EditProduct from "./pages/artisan/EditProduct";
import SalesReport from "./pages/artisan/SalesReport";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Navbar />

      <main
         className="p-4 min-h-[80vh]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />
          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

          <Route
  path="/my-orders"
  element={
    <ProtectedRoute requiredRole="USER">
      <MyOrders />
    </ProtectedRoute>
  }
/>

<Route
  path="/artisan/dashboard"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <ArtisanDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/artisan/orders"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <ArtisanOrders />
    </ProtectedRoute>
  }
/>
<Route
  path="/artisan/products"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <MyProducts />
    </ProtectedRoute>
  }
/>
<Route
  path="/artisan/add-product"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <AddProduct />
    </ProtectedRoute>
  }
/>
<Route
  path="/artisan/edit-product/:productId"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <EditProduct />
    </ProtectedRoute>
  }
/>
<Route
  path="/artisan/sales-report"
  element={
    <ProtectedRoute requiredRole="ARTISAN">
      <SalesReport />
    </ProtectedRoute>
  }
/>
          {/* User Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requiredRole="USER">
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;