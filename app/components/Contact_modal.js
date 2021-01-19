import React, { Component, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import { useAlert } from 'react-alert';
import PhoneInput from "react-phone-input-2";


function Contact_modal(props) {
  const appDispatch = useContext(DispatchContext);
  const [phone, setphone] = useState();
  const alert = useAlert();

  // navigator.geolocation.getCurrentPosition(function (position) {
  //   setCurrentLat(position.coords.latitude);
  //   setCurrentLng(position.coords.longitude);
  // });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (phone.length != 10) {
        alert.error(<div style={{color:'#FF0040'}}>Enter a valid phone number</div>);
        return;
      }
      
      let name = props.name;
      let email = props.email;
      const response = await Axios.post("/users/register", { name, email, phone });
      if (response.data) {
        alert.show(<div style={{color:'#2E9AFE'}}>{response.data.message}</div>)
        props.setShowOtp(true);
        props.ShowModal(false)
      } else {
      }
    } catch {
      alert.error(<div style={{color:'#FF0040'}}>something went wrong</div>);
    }
  }

  function handleChange(e){
    setphone(e.target.value)
    props.setParentPhone(e.target.value)
  }
  return (
    <>
      <Modal show={props.modal} onHide={() => props.ShowModal(false)} dialogClassName="contactform" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body>
          {/* <img src="./resources/svg/cancel.svg" onClick={() => props.ShowModal(false)}
           style={{width: "24px", position: 'absolute', right: '28%', top:'10px', float: 'right', right: '20px'}} />
          <section className="clearfix">
            <div className="contact-form-inner">
              <Form onSubmit={handleSubmit}>
                  <div className="form-col-12">
                    <label htmlFor="property-subType">Phone no.</label>
                    <input type="number form-control" style={{width: '100%',height: '50px', background: '#EAEAEA', border: 'none', borderRadius: '5px'}} name="phone" value={phone} onChange={handleChange} required />
                  </div>
                <button className="post-form">Submit</button>
              </Form>
            </div>
          </section> */}

<div className="loginform-popup" id="login_form">
          <button type="button" className="close close-model-btn" data-dismiss="modal">
                <img src="./resources/svg/cancel.svg" onClick={() => props.ShowModal(false)}  style={{width: "28px", position: 'absolute', right: '4%'}} />
              </button>
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="content">
                <h1 className="prop text-center py-3">PropShots</h1>
                <h2 className="desc text-center pb-4">
                  <i>Enter Your Mobile Number</i>
                </h2>
                <div className="actual-content" style={{textAlign: 'center'}}>
                  <div id="phoneinput">
                    <input type="phone" className="form-control txt-box" name="phone" value={phone} onChange={handleChange} placeholder="Enter Your Phone"  maxLength={10} required />
                  </div>
                  <div className="clear"></div>
                  <br/>
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
    </>
  );
}

export default withRouter(Contact_modal);
