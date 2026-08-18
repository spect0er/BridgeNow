const TOKEN_KEY = 'bn_auth_token';

// Support VITE_API_URL environment variable for production deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getSavedToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setSavedToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeSavedToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  let data = null;
  if (text && contentType && contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // JSON parse failed
    }
  } else if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Not JSON
    }
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || (response.status === 504 || response.status === 502
      ? 'Backend server is unreachable. Please ensure server is running (npm run dev:all).'
      : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  if (!data) {
    throw new Error('Backend server returned an invalid or empty response. Please ensure server is running.');
  }

  return data;
};

export const registerApi = async ({ name, email, password, role }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await parseResponse(response);

  if (data.token) {
    setSavedToken(data.token);
  }

  return data;
};

export const loginApi = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(response);

  if (data.token) {
    setSavedToken(data.token);
  }

  return data;
};

export const fetchMeApi = async () => {
  const token = getSavedToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      removeSavedToken();
      return null;
    }

    const data = await parseResponse(response);
    return data.user;
  } catch (error) {
    return null;
  }
};

export const verifyTokenApi = async () => {
  const token = getSavedToken();
  if (!token) return { valid: false };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return { valid: false };
    return await parseResponse(response);
  } catch (e) {
    return { valid: false };
  }
};

export const logoutUser = async () => {
  const token = getSavedToken();
  removeSavedToken();

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
  } catch (e) {
    // Ignore offline logout errors
  }
};

