// src/features/components/subscription/SubscriptionPlanList.jsx
import React from 'react';
import SubscriptionPlanCard from './subscriptionPlanCard';

const SubscriptionPlanList = ({ plans, onSubscribe }) => {
  console.log('Plans received in list:', plans);  // Add this line

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map(plan => {
        console.log('Mapping plan:', plan);  // Add this line
        return (
          <SubscriptionPlanCard
            key={`subscription-${plan.subid}`}  // Make the key more unique
            plan={plan}
            onSubscribe={onSubscribe}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionPlanList;