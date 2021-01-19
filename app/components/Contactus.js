import Axios from "axios";
import React, { useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import StateContext from "../StateContext";
import { Modal, Form } from "react-bootstrap";
import { useAlert } from 'react-alert';

function Contactus(props) {
  const appState = useContext(StateContext);
  const [userInfo, setUserInfo] = useState({name: '', email: '', phone: '', desc: ''});
  const alert = useAlert();

  async function handleSubmit(e) {
    e.preventDefault();
    if(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(userInfo.email)) {
      await Axios.post("/users/welcome_mail", userInfo, { headers: { Authorization: `Bearer ${appState.user.token}` } }).then((result) => {
        alert.success(<div style={{color:'#00cc00'}}>{result.data}</div>);
        props.setShow(false);
      });
    }else{
      alert.error(<div style={{color:'#FF0040'}}>Enter a valid email</div>);
      return;
    }
  }

  function handleChange(e){
    let newUserInfo = { ...userInfo };
    newUserInfo[e.target.name] = e.target.value;
    setUserInfo(newUserInfo);
  }

  return (
    <Modal className="no-bg-clr" size="md" show={props.show} onHide={() => props.setShow(false)} dialogClassName="contactform cus-contactform" centered aria-labelledby="example-custom-modal-styling-title" backdrop='static'>
      <div className="modal-body">
        <section className="post-property-contact clearfix mob-post-prop">
        <div className="prop-form-container contact-form-inner">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 text-right pb-2">
                <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)}  style={{width: "24px",position: "absolute",right: "10px",top: "-4px", zIndex: "9999", cursor: "pointer" }} />
              </div>
            </div>
            <div className="row">
              <div className="form-col-12 col-12">
                <label className="mb-0" style={{color: "#605f5f"}} htmlFor="property-subType">Name</label>
                <input type="text" name="name" className="contact-input" value={userInfo.name} onChange={handleChange} maxLength="25" required />
              </div>
            </div>

            <div className="row">
              <div className="form-col-12 col-12">
                <label className="mb-0" style={{color: "#605f5f"}} htmlFor="property-subType">Phone no.</label>
                <input type="number" name="phone" className="contact-input" value={userInfo.phone} onChange={handleChange} maxLength="10" required />
              </div>
            </div>
            <div className="row">
              <div className="form-col-12 col-12">
                <label className="mb-0" style={{color: "#605f5f"}} htmlFor="property-subType">Email</label>
                <input type="text" name="email" className="contact-input" value={userInfo.email} onChange={handleChange}  maxLength="40" required />
              </div>
            </div>
            <div className="row">
              <div className="form-col-12 col-12">
                <label className="mb-0" style={{color: "#605f5f"}} htmlFor="Description">Description</label>
                <div>
                  <textarea name="desc" className="contact-input" style={{ resize: "none" }} rows="4" cols="66" maxLength="250" onChange={handleChange} value={userInfo.desc} >
                    
                  </textarea>
                </div>
              </div>
            </div>
            <button className="post-form">Submit</button>
          </Form>
        </div>
      </section>
      </div>
    </Modal>
  );
}

export default withRouter(Contactus);
