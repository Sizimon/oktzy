const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

const apiRequest = async (endpoint: string, options: RequestInit) => {
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Always send cookies for authentication
        ...options,
    };

    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config); 

        if (response.status === 401) {
            // Just throw an error, let the caller handle it
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || errorData.message || 'API request failed');
            } else {
                const text = await response.text();
                console.error('Non-JSON error response:', text);
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export default apiRequest;