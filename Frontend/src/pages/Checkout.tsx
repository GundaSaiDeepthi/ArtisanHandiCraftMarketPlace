import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // create mock order
      const createRes = await api.post('/mock-payment-api/mock-create-order', {
        products: cartItems.map(item => ({ product: item.product?._id, quantity: item.quantity })),
        totalAmount,
      });
      const orderId = createRes.data.payload.orderId;

      // verify mock payment
      await api.post('/mock-payment-api/mock-verify-payment', { orderId });

      clearCart();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="checkout-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {cartItems.map(item => (
          <li key={item.product?._id}>
            {item.product?.title} x {item.quantity} = ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <h2>Total: ₹{totalAmount.toFixed(2)}</h2>
      <button className="primary" onClick={handlePlaceOrder} disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </motion.div>
  );
};

export default Checkout;
