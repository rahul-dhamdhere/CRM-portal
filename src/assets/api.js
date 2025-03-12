import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Flask backend URL

// Signup API
export const signup = async (memberData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, memberData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.error || "Error signing up" };
    }
};

// Login API
export const login = async (memberData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, memberData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.error || "Error logging in" };
    }
};
