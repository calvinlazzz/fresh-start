import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
const swal = require('sweetalert2');

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem("authTokens");
        console.log("Token retrieved on init:", token);
        return token ? JSON.parse(token) : null;
    });

    const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
        try {
            const parsedToken = JSON.parse(token);
            const decoded = jwt_decode(parsedToken.access);
            console.log("Token decoded on init:", decoded);
            return decoded;
        } catch (e) {
            console.error("Invalid token specified on init", e);
            localStorage.removeItem("authTokens");
            return null;
        }
    }
    return null;
});

    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        const data = await response.json();
        console.log("Login response data:", data);

        if (response.status === 200) {
            console.log("Logged In");
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            console.log("Token stored on login:", JSON.stringify(data));
            history.push("/");
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });

        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        });
        if (response.status === 201) {
            history.push("/login");
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occurred " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        console.log("Token removed on logout");
        history.push("/login");
        swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const refreshToken = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh: authTokens.refresh
            })
        });
        const data = await response.json();
        console.log("Refresh token response data:", data);
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            console.log("Token refreshed:", JSON.stringify(data));
        } else {
            logoutUser();
        }
    };

    useEffect(() => {
        if (authTokens) {
            try {
                const decoded = jwt_decode(authTokens.access);
                console.log("Token decoded in useEffect:", decoded);
                setUser(decoded);
            } catch (e) {
                console.error("Invalid token specified in useEffect", e);
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem("authTokens");
            }
        }
        setLoading(false);
    }, [authTokens]);

    useEffect(() => {
        if (authTokens) {
            const interval = setInterval(() => {
                refreshToken();
            }, 15 * 60 * 1000); // Refresh token every 15 minutes
            return () => clearInterval(interval);
        }
    }, [authTokens]);

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};