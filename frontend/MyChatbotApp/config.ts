// Toggle between using your local server or Render's URL
export const USE_LOCAL_BACKEND = false; // set to false to use Render

// Set the API base URL based on your toggle.
// When testing locally, replace <YOUR_LOCAL_IP> with your computer's local IP address.
export const API_BASE_URL = USE_LOCAL_BACKEND
  ? "http://192.168.1.127:3000"
  : "https://culina.onrender.com";