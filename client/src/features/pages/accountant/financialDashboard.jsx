// src/features/pages/accountant/FinancialDashboard.jsx
import React, { useState, useEffect } from 'react';
import { accountantService } from '../../services/accountantService';   
import SubscriptionList from './subscriptionList';   
import BillingHistory from './billingHistory'; 

const FinancialDashboard = () => { 
    const [activeTab, setActiveTab] = useState('subscriptions');
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSubscriptionData();
    }, []);

    const loadSubscriptionData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Add console.log to help debug
            console.log('Fetching subscription data...');
            const data = await accountantService.getMemberSubscriptionList();
            console.log('Received data:', data);
            setSubscriptionData(data);
        } catch (err) {
            console.error('Detailed error:', err);
            setError('Failed to load subscription data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Financial Dashboard</h1>
                <p className="text-gray-600">Manage subscriptions and billing</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b mb-6">
                <nav className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`py-2 px-4 ${
                            activeTab === 'subscriptions' 
                            ? 'border-b-2 border-blue-500 text-blue-600' 
                            : 'text-gray-500'
                        }`}
                    >
                        Member Subscriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`py-2 px-4 ${
                            activeTab === 'billing' 
                            ? 'border-b-2 border-blue-500 text-blue-600' 
                            : 'text-gray-500'
                        }`}
                    >
                        Billing History
                    </button>
                    
                </nav>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="p-4 text-center">Loading...</div>
                ) : error ? (
                    <div className="p-4 text-red-500">{error}</div>
                ) : (
                    <div className="p-4">
                        {activeTab === 'subscriptions' && (
                            <SubscriptionList 
                                subscriptions={subscriptionData} 
                                onUpdate={loadSubscriptionData}
                            />
                        )}
                        {activeTab === 'billing' && (
                            <BillingHistory 
                                subscriptions={subscriptionData}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialDashboard;