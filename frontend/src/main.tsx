import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import './index.css'
import App from './App.tsx'
import ProductPage from './pages/ProductPage.tsx';
import { CartContextProvider } from './store/CartContext.tsx';
import CartPage from "./pages/CartPage.tsx"
import Authentication from './pages/authentication.tsx';
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <CartContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/authentication" element={<Authentication />} />
        </Routes>
      </BrowserRouter>
    </CartContextProvider>
  </StrictMode>
)
