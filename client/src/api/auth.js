import api from './axiosConfig.js';

// A sleeping backend can take about a minute to start. Do not retry signup
// automatically: a timed-out request may already have created the account.
export const AUTH_TIMEOUT_MS = 90000;

const authenticate = async (path, userData) => {
  const { data } = await api.post(path, userData, { timeout: AUTH_TIMEOUT_MS });

  if (!data || typeof data._id !== 'string' ||
      typeof data.accessToken !== 'string' || !data.accessToken) {
    const error = new Error('The server did not return a valid session.');
    error.code = 'ERR_INVALID_AUTH_RESPONSE';
    throw error;
  }

  return data;
};

export const signIn = (email, password) => (
  authenticate('/auth/login', { email: email.trim(), password })
);

export const signUp = (userData) => (
  authenticate('/auth/register', { ...userData, email: userData.email.trim() })
);

export const getAuthErrorMessage = (error, action = 'login') => {
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return action === 'register'
      ? 'The server took too long to respond. Try signing in before registering again, as your account may have been created.'
      : 'The server took too long to respond. Please try signing in again shortly.';
  }

  if (error.code === 'ERR_NETWORK' || error.code === 'ERR_INVALID_AUTH_RESPONSE' ||
      (!error.response && error.request)) {
    return action === 'register'
      ? 'Unable to confirm registration. Please try signing in before registering again.'
      : 'Unable to reach the sign-in service. Please wait a minute and try again.';
  }

  if (error.response?.status >= 500) {
    return 'The server is temporarily unavailable. Please try again shortly.';
  }

  const message = error.response?.data?.message;
  return typeof message === 'string' && message.trim()
    ? message
    : action === 'register' ? 'Registration failed. Please try again.' : 'Login failed. Please try again.';
};
