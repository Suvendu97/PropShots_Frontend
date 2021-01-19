import React, { Component, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Modal, Form } from "react-bootstrap";
import { Modal, Form } from "react-bootstrap";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";
import OtpInput from "react-otp-input";
import { useAlert, withAlert } from 'react-alert';

function PhoneVerify(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [otp, setotp] = useState();
  const alert = useAlert();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.get("/shortlist/getphone", { headers: { Authorization: `Bearer ${appState.user.token}` }, params:{otp,id:props.id} });
      if (response.data.flag === true) {
        console.log(response.data);
        props.setShow(false);
        props.history.push("/shortlist");
        alert.success(<div style={{color:'#00cc00'}}>Verification Success</div>);
      } else {
        alert.error(<div style={{color:'#FF0040'}}>Invalid OTP</div>);
        console.log(response.data);
      }
    } catch {
      console.log("something went wrong");
    }
  }

  function handleresend() {
    console.log("otp resend");
    try {
      const response2 = Axios.get("/shortlist/resend", { headers: { Authorization: `Bearer ${appState.user.token}` } }) ;
      if(response.data){
        alert.show(<div style={{color:'#2E9AFE'}}>OTP RESENT</div>)
      }
    } catch {
      console.log("something went wrong");
    }
  }

  return (
    <>
      <link rel="stylesheet" href="resources/css/homeGuestNew.css"></link>
      <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName="modal-90w modal-dialog-centered" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body className="phone-verify-modal-body">
          <div className="text-center" id="login_form1">
            <form className="form-container form-container-verify-no" onSubmit={handleSubmit}>
              {/* <button type="button" className="close close-model-btn" data-dismiss="modal"> */}
                <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)}  style={{width: "28px", position: 'absolute', right: '4%'}} />
              {/* </button> */}
              {/* <h1 className="prop">PropShots</h1> */}
              <div className="content">
                {/* <h1 className="prop text-center py-3">PropShots</h1> */}
                <h2 className="desc text-center pb-4">
                  <i>Enter Your Code</i>
                </h2>
              </div>
                {/* <div className="actual-content" style={{textAlign: 'center'}}></div> */}
              {/* <h3 style={{ textAlign: "center" }}>Enter Your Code</h3> */}
              {/* <p style={{ textAlign: "left" }}>
                Enter the code sent to {phone} &nbsp; &nbsp; &nbsp;
                <span id="resend" onClick={handleresend}>
                  Resend
                </span>
              </p> */}
              <p style={{ display: "inline-block" }} className="code-sent-txt code-sent-txt1 mb-0">
                Enter the code sent to your number
              </p>
              <p style={{ textAlign: "right"}} className="code-resend-txt code-resend-txt1 mb-0">
                <span id="resend" onClick={handleresend}>
                  Resend
                </span>
              </p>
              <div className="content">
                {/* <label htmlFor="phone">
                  <b>OTP</b>
                </label> */}
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
                    numInputs={6}
                    containerStyle={{
                      marginTop: "20px",
                      marginLeft: "9px",
                      justifyContent: "center",
                    }}
                    isInputNum={true}
                  />
                  {/* <p style={{ textAlign: "left" }} className="pt-4">
                    <span id="update-contact-info">
                      Update Contact info
                    </span>
                  </p> */}
                  {/* <p style={{textAlign: 'justify', marginTop: '44px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> */}
                  <br></br>
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

export default withRouter(PhoneVerify);
