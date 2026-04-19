import { lazy, StrictMode, Suspense, type JSX } from 'react'
import { Toaster } from './components/ui/sonner.tsx';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import ReactDOM from "react-dom/client";
import { CartContextProvider } from './store/CartContext.tsx';


const App = lazy(() => import("./App"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const Authentication = lazy(() => import("./pages/Authentication"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

import { UserContextProvider, useUser } from "./store/UserContext.tsx"
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = document.getElementById("root");
const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/authentication" replace />;

  return children;
};

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <CartContextProvider>
              <Toaster />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/Product/:id" element={<ProductPage />} />
                  <Route path="/authentication" element={<Authentication />} />

                  <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/userDetails" element={<UserDetails />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/:page" element={<AdminPage />} />
                  </Route>
                  <Route path="/payment/:id" element={<PaymentSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </CartContextProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  )
}
