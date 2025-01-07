import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Registerpage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  };

  return (
    <div>
      <>
        <section className="vh-100" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", minHeight: "100vh" }}>
          <div className="container py-5 h-100" style={{ marginTop: '60px' }}>
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-10">
                <div className="card" style={{ borderRadius: "1rem", height: "auto", maxHeight: "80vh" }}>
                  <div className="row g-0">
                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                      <img
                        src="https://images.unsplash.com/photo-1613742631162-cdba058776b9?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="register form"
                        className="img-fluid"
                        style={{ borderRadius: "1rem 0 0 1rem", width: "100%", height: "100%", maxHeight: "80vh" }}
                      />
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        <form onSubmit={handleSubmit}>
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }} />
                            <span className="h2 fw-bold mb-0">Create an Account</span>
                          </div>
                          <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: 1 }}>
                            Sign up with your email and password
                          </h5>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example17">Email address</label>
                            <input
                              type="email"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example27">Username</label>
                            <input
                              type="text"
                              id="form2Example27"
                              className="form-control form-control-lg"
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example37">Password</label>
                            <input
                              type="password"
                              id="form2Example37"
                              className="form-control form-control-lg"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example47">Confirm Password</label>
                            <input
                              type="password"
                              id="form2Example47"
                              className="form-control form-control-lg"
                              value={password2}
                              onChange={e => setPassword2(e.target.value)}
                              required
                            />
                          </div>
                          <div className="pt-1 mb-4">
                            <button className="btn btn-dark btn-lg btn-block" type="submit">
                              Register
                            </button>
                          </div>
                          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: "#393f81" }}>
                              Login here
                            </Link>
                          </p>
                          <a href="#!" className="small text-muted">Terms of use.</a>
                          <a href="#!" className="small text-muted">Privacy policy</a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
            © 2024 Copyright:
            <a className="text-dark" href="https://mdbootstrap.com/">desphixs.com</a>
          </div>
        </footer>
      </>
    </div>
  );
}

export default Registerpage;