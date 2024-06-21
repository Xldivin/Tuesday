import axios from 'axios';
import { UserProfile } from '@/types';
import { toast } from 'react-toastify';

export const sendPhoneOtp = async (values: any) => {
    try {
        const response = await axios.post('https://api.tuesday.africa/api/v1/auth/send-mobile-otp', values);
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const verifyPhoneOtp = async (values: any) => {
    try {
        const response = await axios.post('https://api.tuesday.africa/api/v1/auth/verify-mobile-otp', values);
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getStocks = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/stocks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getOrdersMe = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/orders/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const placeOrder = async (orderData:any, token:any) => {
    try {
        const response = await axios.post(`https://api.tuesday.africa/api/v1/orders`, orderData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (response.status === 200 || response.status === 201) {
            toast.success('Order successfully placed!');
        }
        return response.data;
    } catch (error:any) {
        console.error('Error placing order:', error);
        toast.error(error.response.data.message);
        throw error;
    }
};

export const getOrders = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/orders/stock/1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getStockById = async (id:any, token:any) => {
    try {
        const response = await axios.get(`https://api.tuesday.africa/api/v1/stocks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getPrices = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/prices', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getUserProfile = async (token: any): Promise<UserProfile> => {
    try {
        const response = await axios.get<UserProfile>('https://api.tuesday.africa/api/v1/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const fetchData = async (year1: any, year2: any, month1: any, month2: any, token: any) => {

    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/prices/compare', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                year1,
                month1,
                year2,
                month2
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

export const fetchGrowthData = async (growth: any, token: any) => {
    try {
        const response = await axios.get(`https://api.tuesday.africa/api/v1/prices/growth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                type: growth
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching growth data:", error);
    }
};

export const sendWatchlist = async (values: any, token:any) => {
    try {
        const response = await axios.post(
            'https://api.tuesday.africa/api/v1/watchlists',
            values,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.success('stock added to watchlist')
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const fetchWatchlist = async (token:any) => {
    try {
        const response = await axios.get(
            `https://api.tuesday.africa/api/v1/watchlists/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const deleteWatchlist = async (watchlistId:any, token:any) => {
    try {
        const response = await axios.delete(
            `https://api.tuesday.africa/api/v1/watchlists/${watchlistId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.success('stock removed to the watchlist')
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const withdrawFlutterWave = async (values: any, token:any) => {
    try {
        const response = await axios.post(
            'https://api.tuesday.africa/api/v1/payments/withdraw-flutterwave',
            values,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.success('Withdrawal successfully made')
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};


export const withdrawStripe = async (values: any, token:any) => {
    try {
        const response = await axios.post(
            'https://api.tuesday.africa/api/v1/payments/withdraw-stripe',
            values,
            {
                headers:{Authorization: `Bearer ${token}`}
            }
        );
        toast.success('Withdrawal successfully made')
        return response.data;
    } catch (error:any) {
        console.log(error)
        toast.error(error.response.data.message)
        console.error('Error occurred:', error);
        throw error;
    }
};

export const fetchTransaction = async (token:any) => {
    try {
        const response = await axios.get(
            `https://api.tuesday.africa/api/v1/transactions/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const fetchPortfolio = async (token:any) => {
    try {
        const response = await axios.get(
            `https://api.tuesday.africa/api/v1/portfolio/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const getWatchlistsStocks = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/watchlists/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const deleteOrder = async (orderId:any, token:any) => {
    try {
        const response = await axios.delete(
            `https://api.tuesday.africa/api/v1/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.success('order removed in order list')
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        toast.success('order is not removed in order list please try again later')
        throw error;
    }
};

export const getBlogs = async (token: any) => {
    try {
        const response = await axios.get('https://api.tuesday.africa/api/v1/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};

export const getBlog = async (token: any, id:any) => {
    try {
        const response = await axios.get(`https://api.tuesday.africa/api/v1/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};