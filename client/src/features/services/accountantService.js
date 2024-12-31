// src/features/services/accountantService.js - For accountant operations
const ACCOUNTANT_API_URL = 'http://localhost:5001/subscription/memberSub';

export const accountantService = {
  async getMemberSubscriptionList() {
    try {
      const response = await fetch(ACCOUNTANT_API_URL);
      if (!response.ok) throw new Error('Failed to fetch subscription list');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAllBillingRecords() {
    try {
      const response = await fetch(`${ACCOUNTANT_API_URL}/billing`);
      if (!response.ok) throw new Error('Failed to fetch billing records');
      return await response.json();
    } catch (error) {
      console.error('Error fetching billing records:', error);
      throw error;
    }
  },

  async getBillingHistory(subscriptionId) {
    try {
      const response = await fetch(`${ACCOUNTANT_API_URL}/billing/${subscriptionId}`);
      if (!response.ok) throw new Error('Failed to fetch billing history');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateSubscription(data) {
    try {
        const response = await fetch(ACCOUNTANT_API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                member_id: data.member_id,
                new_subid: data.new_subid
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update subscription');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Service error:', error);
        throw error;
    }
},

// Add to your accountantService.js
async updateBillingStatus(billingId, status) {
    try {
        const response = await fetch(`${ACCOUNTANT_API_URL}/billing/${billingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update billing status');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

};

export default accountantService;
