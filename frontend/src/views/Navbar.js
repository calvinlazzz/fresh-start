import { useContext } from "react";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../media/fresh-start-icon.svg";

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    let decoded = null;
    const token = localStorage.getItem("authTokens");
    console.log("Token:", token);

    if (token) {
        try {
            decoded = jwt_decode(token);
            console.log("Decoded token:", decoded);
        } catch (e) {
            console.error("Error decoding token:", e);
        }
    }

    const hStyle = { color: "#B0E0E6" };

    const today = new Date();
    const time = today.getHours();
    const greet = time > 18 ? "Good evening" : time > 12 ? "Good afternoon" : "Good morning";

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
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
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">
                                    Home
                                </a>
                            </li>
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
                                        <Link className="nav-link" to="/todo">
                                            Dailies
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>
                                            Logout
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <h1 style={hStyle}>
                        {greet}, {decoded ? decoded.username : "Guest"}!
                    </h1>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;