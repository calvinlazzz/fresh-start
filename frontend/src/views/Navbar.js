import {useContext} from 'react'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {ReactComponent as Logo} from '../media/fresh-start-icon.svg'

function Navbar() {

  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")


    const decoded = jwt_decode(token) 
    var user_id = decoded.user_id
    const hStyle = {color: "#B0E0E6"};

    var today = new Date();
    var time = today.getHours();
    var greet;
    
    if (time > 18) {
      greet = 'Good evening';
    } else if (time > 12) {
      greet = 'Good afternoon';
    } else if (time >= 0) {
      greet = 'Good morning';
    } else {
      greet = 'Something wrong!';
    }
  

  return (
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <Logo style={{width:"100px", padding:"2px"}} />

          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              {token === null && 
              <>
                <li class="nav-item">
                  <Link class="nav-link" to="/login">Login</Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/register">Register</Link>
                </li>
              </>
              }

            {token !== null && 
              <>
                <li class="nav-item">
                  <Link class="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/todo">Todo</Link>
                </li>
                <li class="nav-item">
                  <a class="nav-link" onClick={logoutUser} style={{cursor:"pointer"}}>Logout</a>
                </li>
              </>
              }   
              
            </ul>
            
          </div>
          <h1 style={hStyle}>{greet}, {decoded.username}!</h1>
          </div>
      </nav>
    </div>
  )
}

export default Navbar