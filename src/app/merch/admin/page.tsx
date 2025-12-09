'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Package, DollarSign, ShoppingCart, Loader2, CheckCircle, Clock, XCircle, LogOut, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  wallet: string;
  totalUSD: number;
  totalSOL: number;
  root5Amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address1: string;
    city: string;
    region: string;
    zip: string;
    country: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price_usd: number;
}

export default function MerchAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
        setUser(session.user);
        loadOrders();
        loadProducts();
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
        setLoggingIn(false);
        return;
      }

      if (data.session) {
        setAuthenticated(true);
        setUser(data.user);
        loadOrders();
        loadProducts();
      }
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setUser(null);
    setOrders([]);
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/merch/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product ${productId}`;
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/merch/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalUSD, 0),
    totalSOL: orders.reduce((sum, order) => sum + order.totalSOL, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        </div>
      </>
    );
  }

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <Lock className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Admin Login</h1>
            <p className="text-gray-400 text-center mb-6">Sign in to access the admin dashboard</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Merch Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="h-6 w-6 text-green-400" />
                <h3 className="text-gray-400 text-sm">Total Orders</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                <h3 className="text-gray-400 text-sm">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-6 w-6 text-green-400" />
                <h3 className="text-gray-400 text-sm">Total SOL</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalSOL.toFixed(4)}</p>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-yellow-400" />
                <h3 className="text-gray-400 text-sm">Pending</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : (
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Wallet</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                          {order.id.slice(0, 20)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                          {order.wallet.slice(0, 8)}...{order.wallet.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <div>${order.totalUSD.toFixed(2)}</div>
                          <div className="text-xs text-gray-400">
                            {order.totalSOL.toFixed(4)} SOL
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="text-xs font-semibold capitalize">
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-effect-strong rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Order Information</h3>
                    <div className="glass-effect-subtle rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="text-white font-mono text-sm">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet:</span>
                        <span className="text-white font-mono text-sm">{selectedOrder.wallet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-white font-bold">
                          ${selectedOrder.totalUSD.toFixed(2)} ({selectedOrder.totalSOL.toFixed(4)} SOL)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROOT5 Amount:</span>
                        <span className="text-green-400 font-bold">{selectedOrder.root5Amount} ROOT5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`capitalize ${getStatusColor(selectedOrder.status)} px-2 py-1 rounded`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Shipping Information</h3>
                    <div className="glass-effect-subtle rounded-lg p-4">
                      <p className="text-white">
                        {selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}
                      </p>
                      <p className="text-gray-300">{selectedOrder.shipping.email}</p>
                      <p className="text-gray-300 mt-2">
                        {selectedOrder.shipping.address1}
                        {selectedOrder.shipping.address2 && `, ${selectedOrder.shipping.address2}`}
                      </p>
                      <p className="text-gray-300">
                        {selectedOrder.shipping.city}, {selectedOrder.shipping.region} {selectedOrder.shipping.zip}
                      </p>
                      <p className="text-gray-300">{selectedOrder.shipping.country}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => {
                        const productName = getProductName(item.productId);
                        return (
                        <div
                          key={index}
                            className="glass-effect-subtle rounded-lg p-4 flex justify-between items-center"
                        >
                            <div className="flex-1">
                              <p className="text-white font-semibold">{productName}</p>
                              <p className="text-gray-400 text-sm">Product ID: {item.productId}</p>
                              <p className="text-gray-400 text-sm">Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-white font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

