/**
 * SWR fetcher for client-side data fetching
 * Handles JSON responses and errors
 */
export const fetcher = async (url: string) => {
    const res = await fetch(url);
    
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object
        throw error;
    }
    
    return res.json();
};

/**
 * Secure fetcher with authentication
 * For authenticated API calls
 */
export const secureFetcher = async (url: string) => {
    const res = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    
    return res.json();
};
