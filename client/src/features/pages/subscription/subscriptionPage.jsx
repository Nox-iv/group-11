// src/features/pages/subscription/SubscriptionPage.jsx
import React, { useState, useEffect } from "react";
// import SubscriptionPlanCard from "../../components/subscription/subscriptionPlanCard";
import subscriptionService from "../../services/subscriptionService";
import SubscriptionPlanList from "../../components/subscription/subscriptionPlanList";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  // src/features/pages/subscription/SubscriptionPage.jsx
  const loadSubscriptionPlans = async () => {
    try {
      const data = await subscriptionService.getSubscriptionPlans();
      console.log('Raw subscription data:', data);
      
      // Let's ensure we only have unique subscription types
      const uniquePlans = Array.from(new Set(data.map(plan => plan.subid)))
        .map(subid => data.find(plan => plan.subid === subid));
      
      console.log('Unique plans:', uniquePlans);
      setPlans(uniquePlans);
    } catch (err) {
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
};

  const handleSubscribe = async (plan) => {
    try {
      // In a real app, you'd get memberId from auth context or similar
      const memberId = 1; // Temporary for testing
      await subscriptionService.subscribeToLibrary(memberId, plan.subid);
      alert("Successfully subscribed!");
    } catch (err) {
      alert("Failed to subscribe. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Library Subscription
      </h1>

      <SubscriptionPlanList plans={plans} onSubscribe={handleSubscribe} />
    </div>
  );
};

export default SubscriptionPage;
