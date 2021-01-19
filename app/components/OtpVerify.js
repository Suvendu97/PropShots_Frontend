import React, { Component, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Form } from "react-bootstrap";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import OtpInput from "react-otp-input";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Otpverify(props) {
  const appDispatch = useContext(DispatchContext);
  const [otp, setotp] = useState();
  const [currentLat, setCurrentLat] = useState();
  const [currentLng, setCurrentLng] = useState();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const alert = useAlert();

  navigator.geolocation.getCurrentPosition(function (position) {
    setCurrentLat(position.coords.latitude);
    setCurrentLng(position.coords.longitude);
  });

  // let phone = props.phone;
  let phone = props.phone;
  async function handleSubmit(e) {
    console.log(e)
    e.preventDefault();
    if (otp) {
      setLoading(true);
    }
    try {
      const browData = await $.browser;
      const ip = await $.getJSON("https://api.ipify.org?format=jsonp&callback=?");
      const response = await Axios.post("/users/login", { phone, otp, currentLat, currentLng, browData, ip });
      setLoading(false);
      if (response.data) {
        console.log(response.data, 'here');
        props.setShow(false)
        appDispatch({ type: "login", data: response.data.Token });
        props.history.push("/");
      } else {
        setLoading(false);
        console.log(response.data);
      }
    } catch {
      setLoading(false);
      alert.error("Wrong Otp");
      console.log("something went wrong");
    }
  }

  function handleresend() {
    console.log("otp resend");
    try {
      const response2 = Axios.post("/users/resendotp", { phone });
    } catch {
      console.log("something went wrong");
    }
  }

  function spinner(loadingState) {
    if (loadingState) {
      return (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body>
          <div className="loginform-popup" id="login_form">
            <form className="form-container" onSubmit={handleSubmit}>
              <button type="button" className="close close-model-btn" data-dismiss="modal">
                <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)} style={{ width: "28px", position: 'absolute', right: '4%' }} />
              </button>
              {/* <h1 className="prop">PropShots</h1> */}
              <div className="content">
                <h1 className="prop text-center py-3">PropShots</h1>
                <h2 className="desc text-center pb-4">
                  <i>Enter OTP</i>
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

              <div className="content">
                {/* <label htmlFor="phone">
                  <b>OTP</b>
                </label> */}
                <div className="actual-content" style={{ textAlign: 'center' }}>
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
                  <h6 style={{ display: "inline-block" }} className="text-center pb-4">
                    OTP sent on {phone}
                  </h6>
                  <br />
                  {/* <p style={{ textAlign: "left" }} className="pt-4">
                    <span id="update-contact-info">
                      Update Contact info
                    </span>
                  </p> */}
                  {/* <p style={{textAlign: 'justify', marginTop: '44px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> */}

                  <button type="submit" className="btn btn-signup">
                    Continue
                  </button>
                  <h6 className="code-resend-txt text-center">
                    <span id="resend" onClick={handleresend}>
                      Resend OTP
                    </span>
                  </h6>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      {spinner(loading)}
    </>
  );
}

export default withRouter(Otpverify);
