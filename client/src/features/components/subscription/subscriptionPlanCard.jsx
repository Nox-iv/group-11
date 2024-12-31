// src/features/components/subscription/SubscriptionPlanCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlanCard = ({ plan, onSubscribe }) => {
  const navigate = useNavigate();

  // Formatting duration remains the same
  const formatDuration = (plan) => {
    if (!plan || !plan.duration) return '';
    const duration = plan.duration;
    
    if (duration.years) {
      const years = parseInt(duration.years, 10);
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (duration.months) {
      const months = parseInt(duration.months, 10);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return 'N/A';
  };

  // Price formatting remains the same
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Navigation handler remains the same
  const handleSubscribeClick = () => {
    navigate('/subscription/billing', {
      state: { plan }
    });
  };

  // Define subscription features based on plan type
  const getPlanFeatures = (planType) => {
    const features = {
      Basic: [
        'Access to basic library collection',
        'Borrow up to 2 books at a time',
        'Online catalog access',
        'Basic customer support'
      ],
      Standard: [
        'Access to extended library collection',
        'Borrow up to 5 books at a time',
        'Priority reservations',
        'Extended borrowing period',
        'Premium customer support'
      ],
      Premium: [
        'Access to complete library collection',
        'Unlimited book borrowing',
        'Priority access to new releases',
        'Exclusive member events',
        '24/7 premium support',
        'Free home delivery'
      ]
    };
    return features[planType] || features.Basic;
  };

  return (
    <div className="max-w-sm w-full mx-auto border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Plan Header */}
      <div className="text-center pb-6 border-b">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.subtype}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">
            ${formatPrice(plan.price)}
          </span>
          <span className="text-gray-600">
            /{formatDuration(plan.duration)}
          </span>
        </div>
      </div>

      {/* Plan Features */}
      <div className="py-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Plan Features:</h4>
        <ul className="space-y-3">
          {getPlanFeatures(plan.subtype).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Button */}
      <div className="pt-6 border-t">
        <button
          onClick={handleSubscribeClick}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg 
                   hover:bg-blue-700 transition-colors duration-200 
                   font-semibold text-center"
        >
          Subscribe Now
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;