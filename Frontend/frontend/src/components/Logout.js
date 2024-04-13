import axios from 'axios';

const Logout = async (navigate) => {
    try {
        // Send a POST request to the server to logout
        await axios.post('http://127.0.0.1:8000/api/users/logout/', {
            refresh_token: localStorage.getItem('refreshToken')
        });

        // Remove both access and refresh tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Redirect to login page after logout
        navigate('/');
    } catch (error) {
        console.error('Error logging out:', error);
        // Handle error if needed
    }
};
export default Logout;
