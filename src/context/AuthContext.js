import jwtDecode from 'jwt-decode';

// ...existing code...

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Invalid token specified", error);
        return null;
    }
};

// ...existing code...
const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);
if (decodedToken) {
    // ...existing code...
} else {
    // Handle invalid token case
    // ...existing code...
}
// ...existing code...
