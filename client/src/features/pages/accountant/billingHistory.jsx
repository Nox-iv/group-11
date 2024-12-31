// src/features/pages/accountant/billingHistory.jsx
import React, { useState, useEffect } from 'react';
import { accountantService } from '../../services/accountantService';

const BillingHistory = () => {
    // We keep only the essential state variables
    const [billingRecords, setBillingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);

    // Load all billing records when the component mounts
    useEffect(() => {
        loadBillingRecords();
    }, []);

    const loadBillingRecords = async () => {
        try {
            setLoading(true);
            const records = await accountantService.getAllBillingRecords();
            // Sort records to show most recent first
            const sortedRecords = records.sort((a, b) => 
                new Date(b.billing_date) - new Date(a.billing_date)
            );
            setBillingRecords(sortedRecords);
        } catch (err) {
            console.error('Failed to load billing records:', err);
            setError('Failed to load billing records');
        } finally {
            setLoading(false);
        }
    };

    // Handle updating the payment status
    const handleStatusUpdate = async (billingId, newStatus) => {
        try {
            await accountantService.updateBillingStatus(billingId, newStatus);
            // Refresh the records to show the updated status
            await loadBillingRecords();
            setEditingStatusId(null);
        } catch (err) {
            setError('Failed to update payment status');
        }
    };

    // Format currency amounts consistently
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format dates in a readable way
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Color-code status for visual clarity
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-4">Loading billing records...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Billing ID
                        </th>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member ID
                        </th>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                        </th>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {billingRecords.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                No billing records found
                            </td>
                        </tr>
                    ) : (
                        billingRecords.map((record) => (
                            <tr key={record.billing_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{record.billing_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.member_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatAmount(record.payment_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.payment_method}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStatusId === record.billing_id ? (
                                        <select
                                            value={record.payment_status}
                                            onChange={(e) => handleStatusUpdate(record.billing_id, e.target.value)}
                                            className="border rounded px-2 py-1"
                                            autoFocus
                                            onBlur={() => setEditingStatusId(null)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    ) : (
                                        <span
                                            onClick={() => setEditingStatusId(record.billing_id)}
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${getStatusStyle(record.payment_status)}`}
                                        >
                                            {record.payment_status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(record.billing_date)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BillingHistory;