// src/features/pages/accountant/subscriptionList.jsx
import React, { useState, useMemo} from 'react';
import { accountantService } from '../../services/accountantService';

const SubscriptionList = ({ subscriptions, onUpdate }) => {
    // State for managing the update operation
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handler for opening the update modal
    const handleUpdateClick = (subscription) => {
        setSelectedSubscription(subscription);
        setIsUpdateModalOpen(true);
    };

    // Handler for updating subscription
    const handleUpdateSubscription = async (newSubId) => {
        try {
            setLoading(true);
            setError(null);
            
            // Log for debugging
            console.log('Updating subscription:', {
                member_id: selectedSubscription.member_id,
                new_subid: parseInt(newSubId)
            });
    
            await accountantService.updateSubscription({
                member_id: selectedSubscription.member_id,
                new_subid: parseInt(newSubId)
            });
    
            setIsUpdateModalOpen(false);
            setSelectedSubscription(null);
            onUpdate(); // Refresh the list
        } catch (err) {
            console.error('Update error:', err);
            setError(`Failed to update subscription: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Sort subscriptions by member_id to maintain consistent order
    const sortedSubscriptions = useMemo(() => {
        return [...subscriptions].sort((a, b) => {
            // Primary sort by member_id
            return a.member_id - b.member_id;
            // You could also sort by date if preferred:
            // return new Date(b.start_date) - new Date(a.start_date);
        });
    }, [subscriptions]);

    // Function to format dates consistently
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Function to determine status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'text-green-600 bg-green-100';
            case 'expired':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="overflow-x-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 border-b">Member ID</th>
                        {/* Add new column for member name */}
                        <th className="px-6 py-3 border-b">Member Name</th>
                        <th className="px-6 py-3 border-b">Subscription Type</th>
                        <th className="px-6 py-3 border-b">Start Date</th>
                        <th className="px-6 py-3 border-b">End Date</th>
                        <th className="px-6 py-3 border-b">Status</th>
                        <th className="px-6 py-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {sub.member_id}
                            </td>
                            <td className="px-6 py-4 border-b">
                                    {/* Combine first_name and last_name */}
                                    {(sub.first_name && sub.last_name) 
                                        ? `${sub.first_name} ${sub.last_name}`
                                        : 'Name Not Available'}
                                </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {sub.subtype}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatDate(sub.start_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatDate(sub.end_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                                    {sub.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleUpdateClick(sub)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    disabled={loading}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">
                            Update Subscription
                        </h2>
                        <p className="mb-4">
                            Current subscription: {selectedSubscription?.subtype}
                        </p>
                        <div className="space-y-4">
                            <select
                                className="w-full border rounded p-2"
                                onChange={(e) => handleUpdateSubscription(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Select new subscription type</option>
                                <option value="1">Basic</option>
                                <option value="2">Standard</option>
                                <option value="3">Premium</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionList;