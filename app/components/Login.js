import React, { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import Otp from "./Otp";
import GoogleLogin from 'react-google-login';
import Axios from "axios";
import { useAlert } from 'react-alert';
import DispatchContext from "../DispatchContext";
import { Link, withRouter } from "react-router-dom";

function Login(props) {
  const [showlogin, setShowlogin] = useState(false);
  const [showotp, setShowotp] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const alert = useAlert();
  const appDispatch = useContext(DispatchContext);

  const responseGoogle = async (res) => {
    if (res.profileObj) {
      setname(res.profileObj.name);
      setemail(res.profileObj.email);
    }
    // setname(res.profileObj.name);
    // setemail(res.profileObj.email);

    const Googleresponse1 = await Axios.post("/users/auth/googleLogin", { name: res.profileObj.name, email: res.profileObj.email });
    if (Googleresponse1) {
      alert.show(<div style={{ color: '#00cc00' }}>Success</div>)
      appDispatch({ type: "login", data: Googleresponse1.data.data.jwtToken });
      props.history.push("/");
    }
  }

  return (
    <>
      <div className="container">
        <div className="modal fade" id="loginModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close close-model-btn" data-dismiss="modal">
                  <img src="./resources/svg/cancel.svg" style={{ width: "28px", position: 'absolute', right: '4%' }} />
                </button>
                <div className="content">
                  <h1 className="prop text-center py-3">PropShots</h1>
                  <h2 className="desc text-center pb-4">
                    <i>GET STARTED</i>
                  </h2>
                  <div className="actual-content">
                    <p>
                      By clicking Log In, you agree to our <u>Terms</u>.
                              Learn how we process your data In our <u>Privacy Policy</u> and <u>Cookie Policy</u>.</p>
                    {/* <div className="sociallogo google">
                              <span className="a">Log In with Google</span>
                            </div>
                            <div className="sociallogo fb">
                              <span className="a">Log In with Facebook</span>
                            </div> */}
                    <div className="sociallogo phone" data-dismiss="modal" onClick={() => { setShowotp(true); props.setShow(false); }}>
                      <span className="a">Log In with Mobile OTP</span>
                    </div>
                    <center className="mt-4">
                      <GoogleLogin
                        clientId="1068589854620-kn3ridiv16t3d07g5534ulbtmrg3no29.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </center>
                    <p className="mt-4"><u>Trouble logging in?</u></p>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}><b> <i>Get The App</i></b></h2>
                    {/* <div id="getapp">
                      <div id="getapp1"> <img src="resources/svg/apple.svg" className="left" style={{ marginLeft: "10px" }} alt="icon" /> <br></br> <p> Coming Soon</p></div>
                      <div id="getapp2"> <img src="resources/svg/google.svg" className="right" id="goole" alt="icon" /> <br></br> <p style={{ marginLeft: "50px" }}> Coming Soon</p></div>
                    </div> */}
                    <div className="row login-apps-div">
                      <div className="col-6 text-center">
                        <div>
                          <img src="resources/svg/apple.svg" style={{marginBottom: "1px"}} className="" alt="icon" width="140px" /> 
                        </div>
                        <p> Coming Soon</p>
                      </div>
                      <div className="col-6">
                        <div style={{width: "140px", textAlign: "center"}}>
                          <img src="resources/svg/google.svg" style={{marginBottom: "1px"}} className="" alt="icon" width="140px" />
                          <p> Coming Soon</p>
                          <div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div id="comingsoontxt">
                              <span> Coming Soon</span>
                              <span> Coming Soon</span>
                            </div> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Otp show={showotp} setShow={setShowotp} />
    </>
  );
}

export default withRouter(Login);
