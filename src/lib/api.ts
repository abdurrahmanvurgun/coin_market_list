import axios from 'axios';
import { toast } from 'react-toastify';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const OPENSEA_API_URL = 'https://api.opensea.io/api/v2';
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY; 
const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY; 

const axiosInstanceCoinGecko = axios.create({
    baseURL: COINGECKO_API_URL,
    headers: {
        'Authorization': `Bearer ${COINGECKO_API_KEY || ''}`,
    },
});

const axiosInstanceOpenSea = axios.create({
    baseURL: OPENSEA_API_URL,
    headers: {
        'x-api-key': OPENSEA_API_KEY, 
    },
});

axiosInstanceCoinGecko.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 429) {
            toast.error('CoinGecko istek sınırı aşıldı, lütfen bir dakika sonra tekrar deneyin.');
        } else {
            toast.error(`CoinGecko API hatası: ${error.response ? error.response.data : error.message}`);
        }
        return Promise.reject(error);
    }
);

axiosInstanceOpenSea.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 429) {
            toast.error('OpenSea istek sınırı aşıldı, lütfen bir dakika sonra tekrar deneyin.');
        } else {
            toast.error(`OpenSea API hatası: ${error.response ? error.response.data.detail : error.message}`);
        }
        return Promise.reject(error);
    }
);

export const fetchCoins = async () => {
    const response = await axiosInstanceCoinGecko.get('/coins/markets', {
        params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d',
        },
    });
    return response.data;
};

export const fetchNFTs = async () => {
    const response = await axiosInstanceOpenSea.get('/events/collection/pixelatedpunks', {
        params: {limit: '5'},
        headers: {accept: 'application/json', 'x-api-key': '0de8ef62e0ad49f6a54c939a90435b0c'}
    });
    return response.data;
};

export { axiosInstanceCoinGecko, axiosInstanceOpenSea };
