const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const API_KEY = 'd44453cf-d0b5-4797-8d8c-5a858bfb9439'; 

type CryptoResponse = {
    data: Array<{
        id: number;
        name: string;
        symbol: string;
        quote: {
            USD: {
                price: number;
            };
        };
    }>;
};

export const fetchCryptoData = async (): Promise<CryptoResponse> => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();

        // Проверяем наличие ключа 'data' в ответе
        if (!jsonResponse || !jsonResponse.data) {
            throw new Error('Invalid response format');
        }

        return jsonResponse;
    } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        throw new Error('Failed to fetch crypto data');
    }
};