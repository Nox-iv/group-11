// src/features/services/subscriptionService.js
const API_BASE_URL = 'http://localhost:5000/subscription';

export const subscriptionService = {
  async getSubscriptionPlans() {                   
    try {
      const response = await fetch(`${API_BASE_URL}/types`);
      if (!response.ok) throw new Error('Failed to fetch subscription plans');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
                                                           

  async subscribeToLibrary(data) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create subscription');
        return await response.json();
    } catch (error) {
        throw error;
    }
},



  async getMemberSubscriptionList() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription list');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

    
};

export default subscriptionService;