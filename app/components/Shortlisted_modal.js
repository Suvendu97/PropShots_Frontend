import React, { Component, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import { useAlert } from 'react-alert';
import StateContext from "../StateContext";
import Carousel from "./Carousel";

function Shortlisted_modal(props) {
  const appState = useContext(StateContext);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '', desc: '' });
  const alert = useAlert();

  async function handleSubmit(e) {
    e.preventDefault();
    if (/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(userInfo.email)) {
      await Axios.post("/users/welcome_mail", userInfo, { headers: { Authorization: `Bearer ${appState.user.token}` } }).then((result) => {
        alert.success(<div style={{ color: '#00cc00' }}>{result.data}</div>);
        props.setShow(false);
      });
    } else {
      alert.error(<div style={{ color: '#FF0040' }}>Enter a valid email</div>);
      return;
    }
  }

  function handleChange(e) {
    let newUserInfo = { ...userInfo };
    newUserInfo[e.target.name] = e.target.value;
    setUserInfo(newUserInfo);
  }

  const getConverted = (value) => {
    var number = value;
    var strNumber = number.toString();
    var count = strNumber.length;
    var first = strNumber[0];
    var last;
    var second;
    if (count == 4 && props.data.pFor == "RENT") {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Thousand");
    } else if (count == 5 && props.data.pFor == "RENT") {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Thousand");
    } else if (count == 6) {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Lakhs");
    } else if (count == 7) {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Lakhs");
    } else if (count == 8) {
      last = strNumber.slice(1, 3);
      return (first + "." + last + " Crore")
    } else if (count == 9) {
      second = strNumber[1];
      last = strNumber.slice(2, 4);
      return (first + second + "." + last + " Crore");
    }
  }

  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
      <Modal show={props.show} onHide={() => props.setShow(false)} dialogClassName="contactform shortlist-modal" aria-labelledby="example-custom-modal-styling-title" centered>
        <img src="./resources/svg/cancel_white.svg" onClick={() => props.setShow(false)}  style={{width: "24px", position: 'absolute', right: '0px', cursor: 'pointer', top:'-32px',zIndex: '9'}} />
        <Modal.Body className="p-0">
          {/* <section className="clearfix"> */}
          <div className="">
            {/* <img src="./resources/svg/cancel.svg" onClick={() => props.setShow(false)}  style={{width: "24px", position: 'absolute', right: '20px', cursor: 'pointer', top:'10px'}} /> */}
            {/* card */}
            <div className="swipe home_card cus-shortlist-modal-home_card">
              <div className="card-img-container">
                {
                  props.data &&
                  <Carousel property={props.data} />
                }
              </div>
              <div className="card-body property">
                <div className="card-body-top">
                  <ul className="dash-card-ul ml-2">
                    <li className="dash-card-ul-li">
                      <ul className="offered-dis-ul offered-dis-ul-last mb-2">
                        <li className="offered-dis-ul-li" style={{ width: '100%' }}>
                          <p className="font-cblack font-size-10 text-left">
                            <b>&#x20B9;&nbsp;</b>
                            {props.data && getConverted(props.data.mv)}
                          </p>
                        </li>
                      </ul>
                      <p style={{ fontSize: '13px' }}>Market Value</p>
                    </li>
                    <li className="dash-card-ul-li">
                      <ul className="offered-dis-ul offered-dis-ul-last mb-2">
                        <li className="offered-dis-ul-li" style={{ width: '100%' }}>
                          <p className="font-cblack font-size-10 text-left">
                            <b>&#x20B9;&nbsp;</b>
                            {props.data && getConverted(props.data.disPer)}
                          </p>
                        </li>
                      </ul>
                      <p style={{ fontSize: '13px' }}>Discounted Offer</p>
                    </li>
                  </ul>
                </div>
                <div className="card-body-bottom">
                  {/* <div className="details">
                    <span className="detail-head-text">
                      {Property.typ}&nbsp;{Property.exCat}&nbsp;For&nbsp;{Property.pFor}
                    </span>
                  </div> */}
                  <div className="details">
                    {props.data ?
                      <>
                        <img src="resources/svg/type_icon.png" className="prop-icon type_img_home" />
                        <span className="detail-text font-weight-bold text-uppercase">
                          {!props.data.subCat.includes(props.data.typ) ? !props.data.exCat.includes(props.data.typ) ? props.data.typ : '' : ''}
                          {` ${props.data.exCat}`} {props.data.pFor && ' For'} {props.data.pFor}
                        </span>
                      </>
                      :
                      <div className="blankData">
                        <span></span>
                      </div>
                    }

                  </div>
                  {/* {appState.location.lat && appState.location.long ?  */}
                  <div className="details">
                    <img src="resources/svg/Path%20132.svg" className="prop-icon" />
                    <span className="detail-text">{props.data ? props.data.typ : ''}</span>
                  </div> {/* : <div></div> } */}
                  <div className="details">
                    <img src="resources/svg/Group%20172.svg" className="prop-icon" />
                    <span className="detail-text">
                      {props.data ? props.data.ar : ''}{props.data ? props.data.arUnit : ''}
                    </span>
                  </div>
                  <div className="details fix_details">
                    <img src="resources/svg/Path%2099-1.svg" className="prop-icon icone-prop-home"></img>
                    <span className="detail-text">{props.data ? props.data.location.add : ''}</span>
                  </div>
                  <div className="details fix_details">
                    <span className="detail-text pl-3 ml-1 text-capitalize font-14">{props.data ? props.data.desc : ''}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* card end */}
          </div>
          {/* </section> */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default withRouter(Shortlisted_modal);