import { getSavedToken } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = getSavedToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const parseResponse = async (response, fallbackError) => {
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Ignore parse failure
    }
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || (response.status === 504 || response.status === 502
      ? 'Backend server is unreachable. Please ensure server is running (npm run dev:all).'
      : fallbackError);
    throw new Error(errorMsg);
  }

  if (!data) {
    throw new Error('Backend server returned invalid response.');
  }

  return data;
};

export const fetchGigsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/gigs`, {
    headers: getAuthHeaders(),
  });
  const data = await parseResponse(response, 'Failed to fetch gigs');
  return data.gigs || [];
};

export const createGigApi = async (gigData) => {
  const response = await fetch(`${API_BASE_URL}/gigs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(gigData),
  });
  const data = await parseResponse(response, 'Failed to create gig');
  return data.gig;
};

export const updateGigProgressApi = async (gigId, progress, status) => {
  const response = await fetch(`${API_BASE_URL}/gigs/${gigId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ progress, status }),
  });
  const data = await parseResponse(response, 'Failed to update gig');
  return data.gig;
};

export const deleteGigApi = async (gigId) => {
  const response = await fetch(`${API_BASE_URL}/gigs/${gigId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await parseResponse(response, 'Failed to delete gig');
};

export const fetchWalletApi = async () => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    headers: getAuthHeaders(),
  });
  return await parseResponse(response, 'Failed to fetch wallet');
};

export const depositFundsApi = async (amount, paymentMethod) => {
  const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, paymentMethod }),
  });
  return await parseResponse(response, 'Deposit failed');
};

export const withdrawFundsApi = async (amount) => {
  const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  return await parseResponse(response, 'Withdrawal failed');
};
