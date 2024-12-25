import { useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../media/fresh-start-icon.svg";
import Weather from "./Weather";

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    let decoded = null;
    const token = localStorage.getItem("authTokens");

    if (token) {
        try {
            decoded = jwt_decode(token);
        } catch (e) {
            console.error("Error decoding token:", e);
        }
    }

    const hStyle = { color: "black" };

    const today = new Date();
    const time = today.getHours();
    const greet = time > 18 ? "Good evening" : time > 12 ? "Good afternoon" : "Good morning";

    const [city, setCity] = useState("New York");
    const [inputCity, setInputCity] = useState("New York");
    const [showForm, setShowForm] = useState(false);

    const handleCityChange = (event) => {
        setInputCity(event.target.value);
    };

    // Debounce input changes and update city
    useEffect(() => {
        const timer = setTimeout(() => {
            setCity(inputCity.trim());
        }, 500); // 500ms delay for debouncing

        return () => clearTimeout(timer); // Cleanup previous timers
    }, [inputCity]);

    const toggleForm = () => {
        setShowForm((prev) => !prev);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: "#B0E0E6" }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <Logo style={{ width: "100px", padding: "2px" }} />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {decoded === null ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/todo" style={{ fontFamily: 'Norican', color: 'white', fontSize: '60px' }}>
                                            Dailies
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="nav-item">
                            <span className="nav-link" style={{ color: 'white', fontSize: '20px' }}>
                                Date: {today.toLocaleDateString()}
                            </span>
                            <div>
                                <div
                                    onClick={toggleForm}
                                    style={{ cursor: "pointer", display: "inline-block", color: "white" }}
                                >
                                    <Weather city={city} />
                                </div>
                                {showForm && (
                                    <div style={{ marginTop: "10px" }}>
                                        <label htmlFor="city" style={{ color: "white", marginRight: "10px" }}>City:</label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={inputCity}
                                            onChange={handleCityChange}
                                            placeholder="Enter city"
                                            style={{ marginRight: "10px", padding: "5px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <h1 style={hStyle}>
                        {greet}, {decoded ? decoded.username : "Guest"}!
                    </h1>
                    <a className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>
                        Logout
                    </a>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;