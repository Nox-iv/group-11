// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import WishlistPage from './features/pages/wishlist/wishlistPage';
import WishlistDetailPage from './features/pages/wishlist/wishlistDetailPage';
import SubscriptionPage from './features/pages/subscription/subscriptionPage';
import BillingPage from './features/pages/subscription/billingPage';
import FinancialDashboard from './features/pages/accountant/financialDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WishlistPage />} />
        <Route path="/wishlist/:id" element={<WishlistDetailPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/subscription/billing" element={<BillingPage />} />
        <Route path="/admin/finance" element={<FinancialDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;