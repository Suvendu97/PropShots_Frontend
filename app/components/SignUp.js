import React, { Component, useState } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";

import { Modal, Form } from "react-bootstrap";
import Axios from "axios";
import OtpVerify from "./OtpVerify";
import Contact_modal from "./Contact_modal";
import GoogleLogin from 'react-google-login';
import { useAlert } from 'react-alert';

function SignUp(props) {
  const alert = useAlert();
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [phone, setphone] = useState();
  const [finger, setFingerprint] = useState();
  const [showotpverify, setShowotpverify] = useState(false);
  const [showpopup, setShowpopup] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();
    try {
      if (phone.length != 10) {
        alert.error(<div style={{color:'#FF0040'}}>Enter a valid phone number</div>);
        return;
      }
      document.querySelector('.close').click()
      const response = await Axios.post("/users/register", { name, email, phone });
      if (response.data) {
        alert.show(<div style={{color:'#2E9AFE'}}>{response.data.message}</div>);
        setShowotpverify(true);
        props.setShow(false);
        console.log(response.data);
      } else {
        console.log(response.data);
      }
    } catch {
      alert.error(<div style={{color:'#FF0040'}}>something went wrong</div>);
    }
  }

  const responseGoogle = (res) => {
    // console.log(res);
    if(res.profileObj) {
      document.querySelector('.close').click()
      setname(res.profileObj.name);
      setemail(res.profileObj.email);
      setShowpopup(true);
    }
    props.setShow(false);
  }

  return (
    <>
      {/* <Modal signupModal={props.show} onHide={() => props.setShow(false)} dialogClassName="contactform" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body>     */}
          <div className="container">
            <div className="modal fade" id="signupModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="close close-model-btn" data-dismiss="modal">
                              <img src="./resources/svg/cancel.svg" style={{width: "28px", position: 'absolute', right: '4%'}} />
                            </button>
                            <form className="form-container-modal" onSubmit={handleSubmit}>
                                <h1 className="prop text-center py-3">PropShots</h1>
                                <h2 className="desc text-center pb-4">
                                  The fastest way to sell or rent your property
                                </h2>
                                <h6>-Swipe right to speed-</h6>
                                <div className="form-group">
                                    <input className="form-control txt-box" type="text" name="name" id="name" placeholder="Enter Name" required onChange={(e) => setname(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input className="form-control txt-box" type="email" name="email" placeholder="Enter Email" required onChange={(e) => setemail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input className="form-control txt-box" type="phone" name="phone" placeholder="Enter Phone" maxLength={10}
                                        required onChange={(e) => setphone(e.target.value)} />
                                </div>
                                
                                {/* <div className="sociallogo google">
                                  <span className="a" clientId={clientId} onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={'single_host_origin'} style={{ marginTop: '100px' }} isSignedIn={false}>Sign up with Google</span>
                                </div> */}
                                <button type ="submit" className="btn btn-signup" id="sign_up">Sign Up</button>
                                <div className="mt-4">
                                  <GoogleLogin
                                      clientId="1068589854620-kn3ridiv16t3d07g5534ulbtmrg3no29.apps.googleusercontent.com"
                                      buttonText="Signup with Google"
                                      onSuccess={responseGoogle}
                                      onFailure={responseGoogle}
                                      cookiePolicy={'single_host_origin'}
                                  />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        {/* </Modal.Body>
      </Modal> */}
      <Contact_modal modal={showpopup} ShowModal={setShowpopup} name={name} email={email} setParentPhone={setphone} showOtp={showotpverify} setShowOtp={setShowotpverify} />
      <OtpVerify show={showotpverify} setShow={setShowotpverify} phone={phone} />
    </>
  );
}

export default SignUp;
