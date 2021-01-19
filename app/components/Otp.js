import React, { Component, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Modal, Form } from "react-bootstrap";
import Axios from "axios";
import OtpVerify from "./OtpVerify";
import { useAlert } from 'react-alert';


function Otp(props) {
  const [phone, setphone] = useState();
  const [showotpverify, setShowotpverify] = useState(false);
  const alert = useAlert();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (phone.length !== 12) {
        // showNotificationError("Incorrect Phone Number!");
        alert.error(<div style={{ color: '#FF0040' }}>Enter a valid phone number</div>);
        console.log("enter a valid phone", phone.length);
        return;
      }
      const response = await Axios.post("/users/otp", { phone });
      // console.log(response);
      if (response.data.data) {
        setShowotpverify(true);
        props.setShow(false);
      } else {
        console.log(response.data);
        alert.error(<div style={{ color: '#FF0040' }}>User Not found, Please Signup</div>)
      }
    } catch {
      console.log("something went wrong");
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body>
          <div className="loginform-popup" id="login_form">
            <button type="button" className="close close-model-btn" data-dismiss="modal">
              <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)} style={{ width: "28px", position: 'absolute', right: '4%' }} />
            </button>
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="content">
                <h1 className="prop text-center py-3">PropShots</h1>
                <h2 className="desc text-center pb-4">
                  <i>Enter Your Mobile Number</i>
                </h2>
                <div className="actual-content" style={{ textAlign: 'center' }}>
                  <div id="phoneinput">
                    {/* <select id="countrycode" name="country" required>
                      <option value="+91" defaultValue>
                        IN
                        </option>
                    </select> */}
                    <PhoneInput style={{ float: 'left', marginLeft: '10px', width: 'calc(100% - 55px)' }}
                      country={"in"} value={phone} onEnterKeyPress={e => handleSubmit(e)} onChange={setphone} placeholder="Enter Your Phone" required />
                  </div>
                  <div className="clear"></div>
                  <br />
                  {/* <p style={{textAlign: 'justify', marginTop: '50px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type 
                    specimen book.</p> */}

                  <button type="submit" className="btn btn-signup">
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <OtpVerify show={showotpverify} setShow={setShowotpverify} phone={phone ? phone.slice(2, 12) : phone} />
    </>
  );
}

export default Otp;
