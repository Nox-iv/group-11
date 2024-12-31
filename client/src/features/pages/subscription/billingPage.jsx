// src/features/pages/subscription/SubscriptionBillingPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../../services/subscriptionService';

const BillingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlan = location.state?.plan;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        paymentMethod: 'credit_card'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            // Create subscription and process payment
            await subscriptionService.subscribeToLibrary({
                subid: selectedPlan.subid,
                first_name: formData.firstName,
                last_name: formData.lastName,
                payment_amount: selectedPlan.price,
                payment_method: formData.paymentMethod
            });
    
            alert('Subscription processed successfully!');
            navigate('/subscription/confirmation');
        } catch (err) {
            console.error('Detailed error:', err);
            setError('Failed to process subscription. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!selectedPlan) {
        return <div className="text-center">No plan selected. Please choose a subscription plan.</div>;
    }

    const formatDuration = (duration) => {
        if (!duration) return '';
        
        // Handle the interval object
        if (duration.months) {
            return `${duration.months} ${duration.months === 1 ? 'month' : 'months'}`;
        } else if (duration.years) {
            return `${duration.years} ${duration.years === 1 ? 'year' : 'years'}`;
        }
        return duration.toString();
    };


    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Complete Your Subscription</h1>
            
            {/* Plan Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-2">Selected Plan: {selectedPlan.subtype}</h2>
                <p className="text-gray-600">
                    Price: ${selectedPlan.price} / {formatDuration(selectedPlan.duration)}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="credit_card"
                                checked={formData.paymentMethod === 'credit_card'}
                                onChange={handleInputChange}
                                className="form-radio"
                            />
                            <span>Credit Card</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="bank_transfer"
                                checked={formData.paymentMethod === 'bank_transfer'}
                                onChange={handleInputChange}
                                className="form-radio"
                            />
                            <span>Bank Transfer</span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Confirm Subscription'}
                </button>
            </form>
        </div>
    );
};

export default BillingPage;