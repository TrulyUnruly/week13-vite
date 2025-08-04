// base URL for the API endpoint
export const API_URL = "http://localhost:3000/celebrityDeaths";

// Function to fetch celebrity deaths from the API
export async function fetchCelebrityDeaths() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const celebrities = await response.json();
        return celebrities;
    } catch (error) {
        console.error("Error fetching celebrity deaths:", error);
        return [];
    }
}
