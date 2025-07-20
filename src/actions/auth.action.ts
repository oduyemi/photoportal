/* eslint-disable */
import axios from 'axios';


export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
}


export async function logoutUser() {
  try {
    await axios.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout failed', error);
  }
}
