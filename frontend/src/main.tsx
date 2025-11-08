import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'
import App from './App.tsx'
import ProductPage from './pages/ProductPage.tsx';
import { CartContextProvider } from './store/CartContext.tsx';
import CartPage from "./pages/CartPage.tsx"
import Authentication from './pages/Authentication.tsx';
import { UserContextProvider } from "./store/UserContext.tsx"
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import UserDetails from './pages/UserDetails.tsx';
import NotFound from './pages/NotFound.tsx';

const root = document.getElementById("root");

const ProtectedRoutes = ({ children }: any) => {
  return (
    <UserContextProvider>
      <CartContextProvider>
        {/* <UserContextProvider> */}
        {children}
        {/* </UserContextProvider> */}
      </CartContextProvider>
    </UserContextProvider>
  )
}

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoutes>
              <App />
            </ProtectedRoutes>
          }
          />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="/cart" element={
            <ProtectedRoutes>
              <CartPage />
            </ProtectedRoutes>
          } />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/payment/:id" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}
