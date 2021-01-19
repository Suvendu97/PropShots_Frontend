import React, { Component, useState, useContext } from "react";
import StateContext from "../StateContext";
import { Link, withRouter } from "react-router-dom";

import { Modal, Form } from "react-bootstrap";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import OtpInput from "react-otp-input";
import { useAlert } from 'react-alert'

function Emailverify(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [otp, setotp] = useState();
  const [msg, setMSG] = useState();
  const [currentLat, setCurrentLat] = useState([]);
  const [currentLng, setCurrentLng] = useState([]);

  navigator.geolocation.getCurrentPosition(function (position) {
    setCurrentLat(position.coords.latitude);
    setCurrentLng(position.coords.longitude);
  });

  let enterOtp = otp;
  let vOtp = props.vOtp;
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(vOtp != enterOtp){
        setMSG("Incorrect OTP!");
      }else{
        setMSG("");
        await Axios.put("/users/update", { email: props.email }, { headers: { Authorization: `Bearer ${appState.user.token}` } }).then((res) =>{
          props.setShow(false);
          alert.success(<div style={{color:'#00cc00'}}>Profile updated Successfully!</div>);
          setotp("");
        });
      }
      
    } catch {
      alert.error(<div style={{color:'#FF0040'}}>something went wrong</div>);
    }
  }

  const alert = useAlert();

  async function handleresend() {
    try {
      await Axios.post("/users/verifyMail", { email: props.email }, { headers: { Authorization: `Bearer ${appState.user.token}` } }).then((result) => {
        if(typeof result.data[0].about_mail != 'number'){
          alert.error(<div style={{color:'#FF0040'}}>{result.data[0].about_mail}</div>);
          props.setShow(false);
        }else{
          alert.show(<div style={{color:'#2E9AFE'}}>OTP resent!</div>)  
          props.sethiddenOtp(result.data[0].about_mail);
          props.setShow(true);
        }
        
      });
    } catch(err) {
      alert.error(<div style={{color:'#FF0040'}}>something went wrong</div>,err);
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body>
          <div className="loginform-popup" id="login_form">
            <form className="form-container" onSubmit={handleSubmit}>
              <button type="button" className="close close-model-btn" data-dismiss="modal">
                <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)}  style={{width: "28px", position: 'absolute', right: '4%'}} />
              </button>
              <div className="content">
                <h1 className="prop text-center py-3">PropShots</h1>
                <h2 className="desc text-center pb-4">
                  <i>Enter Your Code</i>
                </h2>
              </div>
              <p style={{ display: "inline-block" }} className="code-sent-txt">
                Enter the code sent to {props.email}
              </p>
              <p style={{ textAlign: "right"}} className="code-resend-txt">
                <span id="resend" onClick={handleresend}>
                  Resend
                </span>
              </p>
              <div className="content">
                <div className="actual-content" style={{textAlign: 'center'}}>
                  <OtpInput
                    value={otp}
                    onChange={setotp}
                    inputStyle={{
                      width: "39px",
                      height: "39px",
                      color: "black",
                      marginRight: "12px",
                      fontSize: "16px",
                      border: "1px solid lightgray",
                      borderRadius: "4px",
                      background: "#F4F4F4 0% 0% no-repeat padding-box",
                      outline: "none",
                    }}
                    numInputs={4}
                    containerStyle={{
                      marginTop: "20px",
                      marginLeft: "9px",
                      justifyContent: "center",
                    }}
                    isInputNum={true}
                  />
                  <span style={{ color: "red" }}>{msg}</span>
                  <p style={{ textAlign: "left" }} className="pt-4">
                    <span id="update-contact-info">
                      Update Mail info
                    </span>
                  </p>

                  <button type="submit" className="btn btn-signup">
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default withRouter(Emailverify);
